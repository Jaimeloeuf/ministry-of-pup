<template>
  <!-- Hero head: will stick at the top on load -->
  <div class="hero-head">
    <!-- is fixed top will keep it sticky at the top of the page -->
    <!-- is-white -->
    <nav id="nav" class="navbar is-fixed-top" role="navigation">
      <!-- Container to force nav bar into center with wider side margins -->
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item pt-0" href="#">
            <img src="../assets/logo_navbar.jpg" alt="Logo" />
          </a>

          <!-- Using <a> instead of button as it does not need an icon and dont have the inverted colors on click behaviour -->
          <a
            role="button"
            class="navbar-burger"
            :class="{ 'is-active': showMobileMenu }"
            aria-label="menu"
            data-target="navbar-menu"
            @click="showMobileMenu = !showMobileMenu"
          >
            <!-- 3 empty span tags to show the burger menu icon -->
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>

        <div
          class="navbar-menu has-text-right mt-2"
          :class="{ 'is-active': showMobileMenu }"
        >
          <!-- Show the menu at the other end -->
          <div class="navbar-end">
            <!-- <a class="navbar-item is-active"> </a> -->

            <!-- Using v-html instead of string interpolation to support html link names like using icons -->
            <span
              v-for="(menuItem, i) in menuItems"
              :key="i"
              @click="showMobileMenu = false"
              :class="{ 'greyed-link': showMobileMenu && i & 1 }"
            >
              <a
                v-if="menuItem.name !== `<hr />`"
                class="navbar-item"
                v-html="
                  isMobile ? menuItem.name + ' ' + menuItem.icon : menuItem.name
                "
                :href="menuItem.link"
                :target="menuItem.target"
              />
              <span v-else v-html="menuItem.name" />
            </span>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "HeroHead",

  created() {
    // On component creation, trigger the method to calculate if device is mobile,
    // And add the method as a event handler for resizes to handle orientation changes
    // resize event preferred over screen orientation event as that is not supported on safari..
    this.recalculateIsMobile();
    window.addEventListener("resize", this.recalculateIsMobile);
  },

  methods: {
    // Call method to calculate if device is mobile based on screen width and update this.isMobile accordingly
    recalculateIsMobile() {
      // Bulma $desktop breakpoint variable is 1024px, thus check for that to see when navbar will convert to mobile style
      // And if less than that, then the device is considered to be a mobile device
      this.isMobile =
        (window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth) < 1024;
    },
  },

  data() {
    return {
      // Default to not mobile to ensure the icons are not added in first render before it is calculated
      isMobile: false,

      showMobileMenu: false,

      menuItems: [
        {
          name: "Instagram",
          icon: "<i class='fab fa-instagram' />",
          link: "https://instagram.com/ministryofpup/",
          target: "_blank",
        },
        {
          name: "Facebook",
          icon: "<i class='fab fa-facebook-square' />",
          link: "https://www.facebook.com/Ministry-of-PUP-422583404451946/",
          target: "_blank",
        },
        {
          name: "Whatsapp",
          icon: "<i class='fab fa-whatsapp' />",
          link: "https://wa.me/6588022177?text=I%20have%20a%20question%21",
          target: "_blank",
        },
        { name: "<hr />" },
        { name: "Puppies", icon: "<i class='fas fa-dog' />", link: "#OurDogs" },
        // { name: "Puppies", icon: "<i class='fas fa-paw' />", link: "#OurDogs" },
        {
          name: "Book appointment",
          icon: "<i class='far fa-calendar-check' />",
          link: "https://booking.ministryofpup.com/#/?ref=LP",
          target: "_blank",
        },
        {
          name: "App",
          icon: "<i class='fas fa-mobile-alt' />",
          link: "https://app.ministryofpup.com",
          target: "_blank",
        },
        { name: "<hr />" },
        { name: "FAQ", icon: "<i class='fas fa-question' />", link: "#FAQ" },
        {
          name: "About Us",
          // Even though there is no icon, there needs to be an empty string to prevent concatenating 'undefined'
          icon: "",
          link: "#AboutUs",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Gives the nav bar a super thin and light bottom underline to give visual seperation from the content */
#nav {
  border-bottom: 1px solid rgb(231, 231, 231);
}
</style>
