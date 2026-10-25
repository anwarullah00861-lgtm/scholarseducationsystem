import { IconName } from '../../shared/components/app-icon/app-icon';

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
  readonly description?: string;
  readonly icon?: IconName;
}

export interface AdminNavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}
