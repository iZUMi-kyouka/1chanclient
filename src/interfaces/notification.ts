export default interface Notification {
  title: string;
  description: string;
  source: string;
  created_at: Date;
  dismissed?: boolean;
}
