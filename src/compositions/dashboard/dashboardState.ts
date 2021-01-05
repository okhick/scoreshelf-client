import { toRefs, reactive } from '@vue/composition-api';
import { ListingEditData } from '@/@types';
import { Route } from 'vue-router';

interface IDashboardStore {
  activeDashboardView: Route['name'];
  publishModalOpen: boolean;
  publishModalEditData: ListingEditData | null;
}

const DashboardStore = reactive<IDashboardStore>({
  activeDashboardView: '',
  publishModalOpen: false,
  publishModalEditData: null,
});

export default function DashboardState() {
  // ========== Mutations ==========
  function setDashboardView(payload: Route['name']) {
    DashboardStore.activeDashboardView = payload;
  }

  function togglePublishModal() {
    DashboardStore.publishModalOpen = !DashboardStore.publishModalOpen;
  }

  function setPublishModalEditData(payload: ListingEditData) {
    DashboardStore.publishModalEditData = payload;
  }

  function clearPublishModalEditData() {
    DashboardStore.publishModalEditData = null;
  }

  // ========== Getters ==========
  function getCurrentListingId() {
    return DashboardStore.publishModalEditData?.id.uuid;
  }

  return {
    // ---- store ----
    ...toRefs(DashboardStore),
    // ---- mutations ----
    setDashboardView,
    togglePublishModal,
    setPublishModalEditData,
    clearPublishModalEditData,
    // ---- getters ----
    getCurrentListingId,
  };
}
