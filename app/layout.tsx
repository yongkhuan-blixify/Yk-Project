import "./../node_modules/blixify-ui-web/lib/tail.css";
// import AuthWrapper from "../store/AuthWrapper";
// import StoreWrapper from "../store/StoreWrapper";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <title>Cookbook Junction</title>
        {/* <StoreWrapper>
          <AuthWrapper>{children}</AuthWrapper>
        </StoreWrapper> */}
        {children}
      </body>
    </html>
  );
}
