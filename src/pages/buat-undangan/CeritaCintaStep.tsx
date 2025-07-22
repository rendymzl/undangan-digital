import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import React from "react";

type Props = {
  form: any;
  updateForm: (field: string, value: any) => void;
};

const CeritaCintaStep: React.FC<Props> = ({ form, updateForm }) => (
  <div className="space-y-4">
    <Textarea value={form.cerita_cinta} onChange={e => updateForm("cerita_cinta", e.target.value)} placeholder="Tulis cerita cinta kalian..." rows={8} />
    <Input value={form.cover_url} onChange={e => updateForm("cover_url", e.target.value)} placeholder="URL Cover (Opsional)" />
  </div>
);

export default CeritaCintaStep; 