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
  data() {
    // Bulma $desktop breakpoint variable is 1024px, thus check for that to see when navbar will convert to mobile style
    const windowIsNotDesktop = () =>
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) <= 1024;

    // Device is considered a mobile device if it either matches the user agent specified or is not desktop width
    const isMobile =
      navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ||
      windowIsNotDesktop();

    return {
      isMobile,

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
          link: "https://booking.ministryofpup.com",
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
