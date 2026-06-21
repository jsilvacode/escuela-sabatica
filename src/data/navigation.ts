export type NavSection = "home" | "lessons" | "resources" | "bible";

export type NavItem = {
  section: NavSection;
  label: string;
  href: string;
  icon: string;
  external?: boolean;
};

export const navItems: NavItem[] = [
  { section: "home", label: "Inicio", href: "/", icon: "⌂" },
  { section: "lessons", label: "Lecciones", href: "/#lessons-heading", icon: "▣" },
  { section: "resources", label: "Recursos", href: "/recursos", icon: "▤" },
  { section: "bible", label: "Biblia", href: "https://www.santabiblia.cloud", icon: "□", external: true },
];
