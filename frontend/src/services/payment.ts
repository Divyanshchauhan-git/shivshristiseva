/**
 * Payment gateway adapter.
 *
 * The UI never talks to a gateway directly with secrets. It only receives an
 * order id and the gateway's PUBLIC key from our backend, opens the gateway's
 * hosted checkout (UPI / cards / net banking), and hands the callback payload
 * back to the backend for signature verification.
 *
 * `RazorpayStyleGateway` follows the common hosted-checkout pattern used by
 * Indian gateways (Razorpay, Cashfree, PayU have equivalent flows). Swap the
 * implementation here without touching the donation UI.
 */
import type { CreateOrderResponse, PaymentMethod, PaymentStatus } from '@/types';
import { brand } from '@/config/brand';
import { isMockApi } from './api';

export interface GatewayResult {
  outcome: Extract<PaymentStatus, 'success' | 'failed' | 'cancelled' | 'pending'>;
  payload: Record<string, string>;
}

export interface CheckoutInput {
  order: CreateOrderResponse;
  donor: { name: string; email: string; phone: string };
  method: PaymentMethod;
  description: string;
}

export interface PaymentGateway { open(input: CheckoutInput): Promise<GatewayResult> }

/* ---------------------------- Demo gateway ----------------------------
 * Renders an in-app sheet (see components/forms/DemoGatewaySheet) that lets the
 * reviewer choose an outcome. It is clearly labelled and moves no money. */
type Listener = (input: CheckoutInput, resolve: (r: GatewayResult) => void) => void;
let demoListener: Listener | null = null;
export const registerDemoGateway = (l: Listener | null) => { demoListener = l; };

const demoGateway: PaymentGateway = {
  open: (input) => new Promise((resolve) => {
    if (!demoListener) return resolve({ outcome: 'failed', payload: {} });
    demoListener(input, resolve);
  }),
};

/* ------------------------- Hosted-checkout gateway ------------------------- */
declare global { interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open(): void; on(ev: string, cb: (r: unknown) => void): void } } }

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = () => resolve(); s.onerror = () => reject(new Error('Payment page failed to load'));
    document.head.appendChild(s);
  });
}

const razorpayStyleGateway: PaymentGateway = {
  async open({ order, donor, description }) {
    await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    return new Promise<GatewayResult>((resolve) => {
      const rzp = new window.Razorpay!({
        key: order.publicKey, // PUBLIC key only, issued by our backend
        order_id: order.gatewayOrderId,
        amount: order.amount * 100,
        currency: order.currency,
        name: brand.name,
        description,
        prefill: { name: donor.name, email: donor.email, contact: donor.phone },
        notes: { reference: order.reference },
        theme: { color: '#0F3D44' },
        handler: (r: Record<string, string>) => resolve({ outcome: 'success', payload: r }),
        modal: { ondismiss: () => resolve({ outcome: 'cancelled', payload: {} }) },
      });
      rzp.on('payment.failed', () => resolve({ outcome: 'failed', payload: {} }));
      rzp.open();
    });
  },
};

export const paymentGateway: PaymentGateway = isMockApi ? demoGateway : razorpayStyleGateway;
