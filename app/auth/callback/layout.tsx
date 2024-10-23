const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-10 flex flex-col xl:px-0 container">{children}</div>;
};

export default Layout;
