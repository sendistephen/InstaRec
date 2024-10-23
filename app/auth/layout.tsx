const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex justify-center items-center container">
      {children}
    </div>
  );
};

export default Layout;
