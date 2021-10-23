import styles from "./header.module.scss";

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link href="/" passHref>
            <img src="/logo.svg" alt="logo" />
          </Link>
        </div>
      </div>
    </header>
  )
}
