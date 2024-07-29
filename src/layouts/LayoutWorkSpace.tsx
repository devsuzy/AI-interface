import { ComponentBaseProps } from "@/@types";
import { pages } from "@/routes";
import { Outlet, Link } from "react-router-dom";

interface LayoutWorkSpaceProps extends ComponentBaseProps {}

export default function LayoutWorkSpace({}: LayoutWorkSpaceProps) {
  return (
    <div className="wrapper">
      <main>
        <div className="flex w-full h-[100svh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
