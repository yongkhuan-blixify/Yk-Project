import AuthWrapper from "../store/AuthWrapper";
import StoreWrapper from "../store/StoreWrapper";
import "../styles/globals.css";
import "./../node_modules/blixify-ui-web/lib/tail.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <title>Cookbook Junction</title>
        <StoreWrapper>
          <AuthWrapper>{children}</AuthWrapper>
        </StoreWrapper>
      </body>
    </html>
  );
}
