import DemoNotice from "@/components/DemoNotice";

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><DemoNotice />{children}</>;
}

export const metadata = {
  title: "Народный рейтинг — демонстрационный портал",
};
