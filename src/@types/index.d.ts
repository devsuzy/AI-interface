export interface ComponentBaseProps {
  children?: React.ReactNode;
  className?: React.ComponentProps<HTMLElement>["className"];
}

export type AnyOBJ = { [key: string]: any };
