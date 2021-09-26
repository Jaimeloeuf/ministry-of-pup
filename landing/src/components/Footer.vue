<template>
  <footer class="footer">
    <div class="container is-centered">
      <div class="columns is-centered has-text-left">
        <div class="column is-two-fifths">
          <p class="subtitle">About Us</p>
          <p>
            We are a team of dedicated professionals on a Mission to help you
            find the dog you love!
            <br />
            We are based in Singapore with a international team and presence.
          </p>
        </div>

        <br />

        <div class="column is-two-fifths">
          <div>
            <p class="subtitle mb-0">Subscribe to our Newsletter</p>
            <div class="field has-addons">
              <div class="control">
                <input class="input" type="email" placeholder="Email" />
              </div>
              <div class="control">
                <a class="button is-primary">Subscribe</a>
              </div>
            </div>
          </div>

          <br />

          <!-- Social media platforms -->
          <div>
            <p class="subtitle mb-0">Follow us</p>
            <a
              href="https://www.linkedin.com/company/enkel-digital/"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-linkedin" />
            </a>
            <a
              href="https://t.me/Jaimeloeuf"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-telegram" />
            </a>
            <a
              href="https://www.facebook.com/Ministry-of-PUP-422583404451946/"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-facebook" />
            </a>
            <a
              href="https://instagram.com/ministryofpup/"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-instagram-square" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
footer {
  background-color: rgb(51, 51, 51);
}

p,
a,
/* Prevents link from changing color when pressed */
a:visited {
  color: #737373;
}

i {
  /* Give the icons a lighter grey color to prevent the contrast from being too high */
  color: rgb(200, 200, 200);
}

.subtitle {
  /* White but not too glaring from the contrast */
  color: rgb(240, 240, 240);
}
</style>
