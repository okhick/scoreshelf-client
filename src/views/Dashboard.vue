<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3">
        <aside class="menu is-hidden-mobile">
          <p class="menu-label">General</p>
          <ul class="menu-list">
            <li>
              <a class="is-active">Dashboard</a>
            </li>
            <li>
              <a>Customers</a>
            </li>
            <li>
              <a>Other</a>
            </li>
          </ul>
          <p class="menu-label">Administration</p>
          <ul class="menu-list">
            <li>
              <a>Team Settings</a>
            </li>
            <li>
              <a>Manage Your Team</a>
              <ul>
                <li>
                  <a>Members</a>
                </li>
                <li>
                  <a>Plugins</a>
                </li>
                <li>
                  <a>Add a member</a>
                </li>
                <li>
                  <a>Remove a member</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Invitations</a>
            </li>
            <li>
              <a>Cloud Storage Environment Settings</a>
            </li>
            <li>
              <a>Authentication</a>
            </li>
            <li>
              <a>Payments</a>
            </li>
          </ul>
          <p class="menu-label">Transactions</p>
          <ul class="menu-list">
            <li>
              <a>Payments</a>
            </li>
            <li>
              <a>Transfers</a>
            </li>
            <li>
              <a>Balance</a>
            </li>
            <li>
              <a>Reports</a>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column is-9">
        <section class="is-info welcome is-small">
          <div class="container">
            <h1 class="title">Hello, {{ displayName }}</h1>
            <h2 class="subtitle">I hope you are having a great day!</h2>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      displayName: ""
    };
  },
  async mounted() {
    let currentUser = await this.SHARETRIBE.currentUser.show();
    this.displayName = currentUser.data.data.attributes.profile.displayName;
  },
  computed: {
    ...mapState(["SHARETRIBE"])
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/index.scss";
.container {
  padding-top: 6px;
}
.columns {
  width: 100%;
  height: 100%;
  margin-left: 0;
}
.menu-label {
  color: #8f99a3;
  letter-spacing: 1.3;
  font-weight: 700;
}
.menu-list a {
  color: #0f1d38;
  font-size: 14px;
  font-weight: 700;
}
.menu-list a:hover {
  background-color: transparent;
  color: #276cda;
}
.menu-list a.is-active {
  background-color: transparent;
  color: #276cda;
  font-weight: 700;
}
</style>
