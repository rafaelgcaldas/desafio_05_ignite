import Link from 'next/link';

import styles from './previewButton.module.scss';

export function PreviewButton() {
  return (
    <Link href="/api/exit-preview">
      <a className={`${styles.containerButton}`}>
        Sair do modo Preview
      </a>
    </Link>
  );
}
