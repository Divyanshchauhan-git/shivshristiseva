import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, FlaskConical, XCircle, Ban } from 'lucide-react';
import { registerDemoGateway, type CheckoutInput, type GatewayResult } from '@/services/payment';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { inr } from '@/utils/format';

/**
 * Stand-in for the payment gateway's hosted checkout while running on demo data.
 * Lets reviewers exercise every outcome (success, failure, pending, cancelled).
 * It is only mounted when the API is in mock mode.
 */
export function DemoGatewaySheet() {
  const [req, setReq] = useState<{ input: CheckoutInput; resolve: (r: GatewayResult) => void } | null>(null);
  useEffect(() => { registerDemoGateway((input, resolve) => setReq({ input, resolve })); return () => registerDemoGateway(null); }, []);
  const finish = (outcome: GatewayResult['outcome']) => {
    req?.resolve({ outcome, payload: outcome === 'success' ? { gateway_payment_id: 'pay_demo_' + Date.now().toString(36), gateway_order_id: req.input.order.gatewayOrderId, signature: 'demo' } : {} });
    setReq(null);
  };
  return (
    <Modal open={!!req} onClose={() => finish('cancelled')} title="Demo payment gateway" description="This simulates the gateway's secure checkout. No money moves." size="sm">
      {req && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-surface-2 p-4 text-center">
            <p className="text-sm text-muted">{req.input.description}</p>
            <p className="mt-1 font-display text-4xl tabular">{inr(req.input.order.amount)}</p>
            <p className="mt-1 font-mono text-xs text-muted">Ref {req.input.order.reference} · {req.input.method.toUpperCase()}</p>
          </div>
          <p className="flex items-start gap-2 text-xs text-muted"><FlaskConical className="mt-px h-4 w-4 shrink-0 text-warn" aria-hidden="true" />Choose an outcome to preview each result screen.</p>
          <div className="grid gap-2">
            <Button onClick={() => finish('success')} icon={<CheckCircle2 className="h-4 w-4" />}>Complete payment</Button>
            <Button variant="secondary" onClick={() => finish('pending')} icon={<Clock className="h-4 w-4" />}>Leave pending (bank delay)</Button>
            <Button variant="secondary" onClick={() => finish('failed')} icon={<XCircle className="h-4 w-4" />}>Simulate failure</Button>
            <Button variant="ghost" onClick={() => finish('cancelled')} icon={<Ban className="h-4 w-4" />}>Cancel payment</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
