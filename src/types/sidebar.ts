export interface SubRoute {
  name: string;
  href: string;
}

export interface SidebarModule {
  id: string;
  name: string;
  icon: string;
  subRoutes: SubRoute[];
}