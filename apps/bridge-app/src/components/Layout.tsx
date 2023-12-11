export type LayoutProps = {
  children: React.ReactNode
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  footerLeft?: React.ReactNode
  footerRight?: React.ReactNode
}

const classNames = {
  header:
    'flex flex-row w-full h-20 px-6 py-6 align-center justify-between border-b-1',
  main: 'flex flex-row px-6 py-6 justify-center align-center',
  footer: 'flex flex-row w-full h-10 px-6 py-6 justify-between',
}

export const Layout = ({
  children,
  headerLeft,
  headerRight,
  footerLeft,
  footerRight,
}: LayoutProps) => {
  return (
    <>
      <header className={classNames.header}>
        <div className="header-left flex items-center">{headerLeft}</div>

        <div className="header-right flex justify-center items-center">
          {headerRight}
        </div>
      </header>

      <main className={classNames.main}>{children}</main>

      <footer className={classNames.footer}>
        <div className="footer-left">{footerLeft}</div>

        <div className="footer-right">{footerRight}</div>
      </footer>
    </>
  )
}
