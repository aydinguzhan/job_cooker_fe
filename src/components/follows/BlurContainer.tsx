type Props = {
  label: string;
  description: string;
};

export default function BlurContainer({ label, description }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur ">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{description}</p>
    </div>
  );
}
