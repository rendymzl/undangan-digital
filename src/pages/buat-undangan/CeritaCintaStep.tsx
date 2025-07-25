import { Textarea } from "../../components/ui/textarea";
import React from "react";

type Props = {
  form: any;
  updateForm: (field: string, value: any) => void;
};

const CeritaCintaStep: React.FC<Props> = ({ form, updateForm }) => (
  <div className="space-y-4">
    <label className="block font-medium text-sm mb-1" htmlFor="cerita-cinta">
      Cerita Cinta <span className="text-muted-foreground">(opsional)</span>
    </label>
    <Textarea
      id="cerita-cinta"
      value={form.ceritaCinta ?? ""}
      onChange={e => updateForm("ceritaCinta", e.target.value)}
      placeholder="Tulis kisah cinta kalian di sini, misal: bagaimana bertemu, perjalanan cinta, atau momen spesial lainnya..."
      rows={8}
      className="resize-none"
    />
    <p className="text-xs text-muted-foreground">
      Cerita ini akan ditampilkan di undangan digital. Kosongkan jika tidak ingin menampilkan cerita.
    </p>
  </div>
);

export default CeritaCintaStep;