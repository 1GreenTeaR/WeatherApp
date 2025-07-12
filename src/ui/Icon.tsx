import { normalizeModule } from "./utils/import";

const modules = normalizeModule(
  import.meta.glob("../assets/icons/*.svg", {
    eager: true,
    query: "raw",
    import: "default",
  })
);

type Props = {
  size?: number;
  name: string;
};

export function Icon({ name, size = 24 }: Props) {
  return (
    <div
      className="icon"
      style={{ width: size, height: size, fill: "currentColor" }}
      dangerouslySetInnerHTML={{ __html: modules[name] ?? "" }}
    ></div>
  );
}
