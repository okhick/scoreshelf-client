import DashboardState from './dashboardState';

export default function useDashboard() {
  const useDashboardState = DashboardState();
  return {
    useDashboardState,
  };
}
