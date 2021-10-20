import styles from "./header.module.scss";

export function Header() {
  return (
    <header>
      <div className={styles.container}>
        <div className={styles.content}>
          <img src="/logo.svg" alt="logo" />
        </div>
      </div>
    </header>
  )
}
