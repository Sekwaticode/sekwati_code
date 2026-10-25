import { formatDate } from "@/lib/crm/types";
import type { Contract } from "@/lib/portal/types";

export function AcceptanceRecord({ contract }: { contract: Contract }) {
  if (contract.status !== "accepted" || !contract.accepted_at) return null;
  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm">
      <h2 className="font-medium text-emerald-900">Acceptance record</h2>
      <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
        <dt className="text-emerald-800">Accepted by</dt>
        <dd>{contract.signer_name}</dd>
        <dt className="text-emerald-800">Date and time</dt>
        <dd>{formatDate(contract.accepted_at)}</dd>
        <dt className="text-emerald-800">IP address</dt>
        <dd>{contract.signer_ip ?? "—"}</dd>
        <dt className="text-emerald-800">Browser</dt>
        <dd className="break-words">{contract.signer_user_agent ?? "—"}</dd>
        <dt className="text-emerald-800">Document fingerprint</dt>
        <dd className="break-all font-mono text-xs">SHA-256 {contract.body_sha256}</dd>
      </dl>
      <p className="mt-3 text-xs text-emerald-800">
        The fingerprint is calculated from the exact contract text at the moment of acceptance. Accepted contracts are
        locked and can&apos;t be edited or deleted.
      </p>
    </section>
  );
}
