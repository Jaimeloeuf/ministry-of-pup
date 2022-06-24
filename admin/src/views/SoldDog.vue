<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="title">Sold Dog</p>
    </div>

    <div class="column is-full pb-0">
      <b>Customer from</b>
    </div>

    <div class="column is-full">
      <div class="tabs is-toggle is-centered is-fullwidth">
        <ul>
          <li :class="{ 'is-active': show === 'a' }">
            <a @click="switchUserView('a')">Appointment</a>
          </li>
          <li :class="{ 'is-active': show === 'w' }">
            <a @click="switchUserView('w')">Walk In</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Show user details once logged in for user to review, and to go edit details if needed -->
    <div class="column is-full box" v-if="loggedIn">
      <div class="columns is-multiline is-vcentered">
        <div class="column is-half">
          <b>First Name</b>
          <br />

          {{ user.fname }}
        </div>

        <div class="column is-half">
          <b>Last Name</b>
          <br />

          {{ user.lname }}
        </div>

        <div class="column is-half">
          <b>Phone Number</b>
          *Without the +65 prefix
          <br />

          {{ user.number }}
        </div>

        <div class="column is-half">
          <b>Email</b>
          *Sales receipt will be sent here
          <br />

          {{ user.email }}
        </div>

        <div class="column is-full">
          <b>Address</b>
          *Full Address including any unit number
          <br />

          <span v-if="user.address">{{ user.address }}</span>
          <i v-else>nil</i>
        </div>

        <div class="column">
          <b>Postal Code</b>
          *Format is 6 digits only
          <br />

          <span v-if="user.postalCode">{{ user.postalCode }}</span>
          <i v-else>nil</i>
        </div>

        <div class="column is-narrow">
          <button class="button is-light is-danger" @click="logout">
            logout
          </button>
        </div>

        <div class="column is-narrow">
          <router-link
            :to="{ name: 'user-details', query: { userID: user.id } }"
            class="button is-light is-warning"
          >
            Update Details
          </router-link>
        </div>

        <div class="column is-full mt-6">
          <label>
            Your IC is needed for a dog purchase, your IC
            <b>will only be used and stored in the sales agreement</b> and no
            where else. Learn more about Ministry Of Pup's
            <router-link :to="{ name: 'privacy-policy' }">
              Privacy & Data Policy
            </router-link>

            <input
              type="text"
              v-model="buyer_ic"
              placeholder="E.g. S1234567A"
              class="input"
            />
          </label>
        </div>
      </div>
    </div>

    <div class="column is-full" v-else-if="show === 'a'">
      <b>Sold to</b>

      <!-- Dropdown showing list of names of all users who have a appointment today -->
      <div class="select is-fullwidth">
        <select
          ref="appointmentUserDropdown"
          v-on:change="
            (event) =>
              (userID = event.target.value) && login(event.target.value)
          "
        >
          <option hidden disabled selected value="defaultPrompt">
            Please select a user
          </option>

          <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
          <!-- @todo v-for="user in users" -->
          <option
            v-for="user in [{ id: 'VdDl8IEvkw1CQnGi3PlL', text: 'JJ' }]"
            :value="user.id"
            :key="user.id"
            :selected="user.id === userID"
          >
            {{ user.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="column is-full" v-else-if="show === 'w'">
      <div class="columns">
        <div class="column is-half">
          <label>
            <b>Create Account</b>
            <br />
            *User MUST HAVE an account first

            <!-- If user clicks to create account using this link, it will redirect back here once account created -->
            <router-link
              :to="{
                name: 'user-create',
                query: { redirect: { name: 'sold-dog' } },
              }"
              class="button is-light is-success is-fullwidth"
            >
              Create Account
            </router-link>
          </label>
        </div>

        <div class="column is-half">
          <label>
            <b>Phone Number</b>
            <br />
            *Enter number <b>without</b> the +65 prefix

            <div class="field has-addons">
              <div class="control is-expanded">
                <input
                  v-autofocus
                  type="number"
                  pattern="[\s0-9]+"
                  min="0"
                  v-model="user.number"
                  placeholder="E.g. 92345678"
                  class="input"
                  @keypress.enter="login()"
                />
              </div>
              <div class="control">
                <button class="button is-success" @click="login()">
                  Login
                </button>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <!-- Show dog details once dog object is loaded -->
      <div v-if="dog">
        <DogCard :dog="dog" />
        <br />

        <!-- Simply resets the selected dogID to show the dropdown list again for admin to select again -->
        <button
          class="button is-light is-warning is-fullwidth"
          @click="dogID = undefined"
        >
          Change Dog
        </button>
        <br />

        <label>
          <!-- 
            Show SRP without auto fill to force admin to type it out again
            Then if differs from SRP, warn user before allowing them to proceed
            This is to prevent user from just clicking sold without updating the price if it has change after negotiation
          -->
          <b>Final sale price</b> (SRP is {{ formatCurrency(dog.srp) }})
          <br />
          <!-- @todo parseInt for salePrice? -->
          <p v-if="salePrice * 100 < dog.srp">*Less than SRP</p>
          <p v-if="salePrice * 100 > dog.srp">*More than SRP</p>

          <div class="field has-addons">
            <div class="control is-expanded">
              <!-- @todo parseInt for salePrice? -->
              <input
                type="number"
                v-model="salePrice"
                pattern="[\s0-9]+"
                placeholder="E.g. 10000 for $10,000 where unit is dollars"
                class="input"
                :class="{
                  'is-danger': salePrice * 100 < dog.srp,
                  'is-warning': salePrice * 100 > dog.srp,
                }"
              />
            </div>
            <div class="control">
              <button
                class="button is-light is-danger"
                @click="salePrice = undefined"
              >
                Clear
              </button>
            </div>
          </div>
        </label>
        <br />
        <br />

        <label>
          <b>Deposit</b> (leave blank if customer paying full amount
          immediately)
          <br />
          <p v-if="parseInt(deposit) >= parseInt(salePrice)">
            *Deposit amount must be less than sale price
          </p>

          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                type="number"
                v-model="deposit"
                pattern="[\s0-9]+"
                placeholder="E.g. 2000 for $2000 where unit is dollars"
                class="input"
                :class="{
                  'is-danger': deposit > salePrice,
                }"
              />
            </div>
            <div class="control">
              <button
                class="button is-light is-danger"
                @click="deposit = undefined"
              >
                Clear
              </button>
            </div>
          </div>
        </label>
      </div>

      <!-- Show dropdown list of available dog names if no dog is selected yet -->
      <label v-else>
        <b>Which dog?</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="(event) => (dogID = event.target.value)">
            <option hidden disabled selected value>Please select a dog</option>

            <option
              v-for="dog in dogs"
              :value="dog.id"
              :key="dog.id"
              :selected="dog.id === dogID"
            >
              {{ dog.name }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button
        @click="showSalesAgreementSection"
        class="button is-light is-fullwidth is-success"
      >
        Confirm details & Show purchase agreement
      </button>
    </div>

    <div class="column is-full" v-if="showSalesAgreement">
      <div class="columns is-multiline is-vcentered box">
        <p class="title">Sales Contract</p>

        <div class="column is-full">
          <b>Contract Parties</b>
          <br />

          The Contract is entered into between the Seller, Ministry of Pup LLP
          and the Buyer,
          <b>{{ `${user.lname} ${user.fname}` }} </b>, NRIC,
          <b>{{ buyer_ic }}</b
          >, in respect of the purchase of the following pet as indicated below,
          on the terms and conditions stated in this Contract. Details of the
          livestock sold is stated below:
        </div>

        <div class="column is-full">
          <b>Livestock Details</b>
          <table class="table is-bordered is-striped is-narrow is-fullwidth">
            <tbody>
              <tr>
                <td>Dog Name</td>
                <td>{{ dog.name }}</td>
              </tr>
              <tr>
                <td>Breed</td>
                <td>{{ dog.breed }}</td>
              </tr>
              <tr>
                <td>Sex</td>
                <td>{{ dog.sex }}</td>
              </tr>
              <tr>
                <td>Microchip number</td>
                <td>{{ dog.mc }}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>{{ dog.dob }}</td>
              </tr>
              <tr>
                <td>Purchase Price</td>
                <td>${{ salePrice }}</td>
              </tr>
              <tr v-if="deposit">
                <td>Deposit</td>
                <td>${{ deposit }}</td>
              </tr>
              <tr>
                <td>Pedigree</td>
                <td>{{ dog.pedigree }}</td>
              </tr>
              <tr>
                <td>HDB Approved</td>
                <td>{{ dog.hdbApproved }}</td>
              </tr>
              <tr>
                <td>Country of Import</td>
                <td>{{ dog.originCountry }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="column is-full content">
          <b>Conditions of Sale</b>
          <ol class="ml-5">
            <li>
              Deposits for booking/ purchase of any Dog shall be non-refundable
              in the case when buyer changes his mind on the purchase.
            </li>
            <li>
              The Dog shall remain in the care and ownership of the Seller until
              the Buyer makes full payment of the purchase price on the
              collection date.
            </li>
            <li>
              The Seller guarantees that the purchased Dog will not have any
              life-threatening defects(congenital) for a duration of 7 days
              starting on the date of this contract. The seller makes no
              warranty, representation, guarantee, or promise that the Dog is
              healthy, free of disease or illness or otherwise fit for purpose.
            </li>
            <li>
              To substantiate and submit claim for guarantee under point 3, a
              complete Vet Report must be produced in 72 hours of receipt from
              the Buyer's veterinarian. The vet has to state the diagnosis and
              the likely cause (whether congenital or genetic) relating to the
              life-threatening defect(s). The Buyers shall bear the cost of
              obtaining the Vet Report.
            </li>
            <li>
              Upon receipt of Vet Report and assessed by the Seller that the
              life-threatening defect is congenital, the seller has the rights
              to either (i) refund only the purchased price upon the return of
              the Dog; (ii) exchange for another dog of same different breed or
              top up price difference for other breeds. In such event, the Buyer
              shall bear all reasonable shipping expenses for the replacement
              puppy.
            </li>
            <li>
              This guarantee of Life-threatening defects shall not be
              enforceable if there is a change of ownership or when the Dog is
              sold to another person.
            </li>
            <li>
              The Seller does not guarantee the color coat of the Dog as the
              assessment is based on Seller's best ability using the Dog
              parents' genetic attributes and their color coat at the point of
              purchase. The sale of pet shall not be invalidated by reason of
              any misdescription of the Dog and no compensation shall be payable
              by the seller.
            </li>
            <li>
              The Seller is only responsible for life-threatening defects within
              the guarantee period as stated above, the Seller shall not
              responsible for any other defects in relation to the Dog.
            </li>
            <li>
              The Buyer shall in the event of any dispute ("Dispute") arising
              out of this agreement, or any information in relation to the
              Dispute shall not be disclosed to any third party.
            </li>
            <li>
              In the event the Buyer dispose of or sell the above-described Dog
              for any reason, Buyer must notify Seller who will have first
              option of refusal.
            </li>
            <li>
              The Buyer represents that he shall not use the Dog for breeding
              purposes.
            </li>
            <li>
              No other warranties or guarantees, expressed or implied, are made
              under this contract except as stated above.
            </li>
          </ol>
        </div>

        <div class="column is-full"><hr class="my-0" /></div>

        <div class="column is-half is-size-6">
          <p class="is-size-7">
            Your signature will be used to generate the
            <i>Sales Agreement</i> which will be sent to your email. A copy of
            the document will be stored by Ministry Of Pup, however your
            standalone Signature <b><i>will not be stored</i></b> anywhere or be
            used for any other purposes outside of the Sales Agreement.
            <br />
            <br />

            Learn more about Ministry Of Pup's
            <router-link :to="{ name: 'privacy-policy' }">
              Privacy & Data Policy
            </router-link>
          </p>
        </div>

        <div class="column is-half">
          <canvas
            id="canvas"
            width="320"
            height="130"
            style="border: 1px solid #000000"
          />
        </div>

        <div class="column is-narrow">
          <!-- Need to add the gaurd clause as signaturePad will be undefined until it is created -->
          <button
            @click="signaturePad && signaturePad.clear()"
            class="button is-light is-danger"
          >
            Reset Signature
          </button>
        </div>

        <div class="column">
          <button
            @click="getSig"
            class="button is-light is-success is-fullwidth"
          >
            I Agree to the Sales Agreement
          </button>
        </div>
      </div>
    </div>

    <div class="column is-full">
      <Payment
        v-model="paymentMethod"
        v-on:payment-complete="paymentComplete"
        v-on:close-modal="showPaymentModal = false"
        :showPaymentModal="showPaymentModal"
        :amount="deposit ? deposit : salePrice"
        :receiptNumber="receiptNumber"
      />
    </div>

    <div class="column">
      <button
        @click="showPaymentModal = true"
        class="button is-light is-success is-fullwidth"
      >
        Pay
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import formatCurrency from "../utils/formatCurrency.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";

import DogCard from "../components/DogCard.vue";
import Payment from "../components/Payment.vue";

export default {
  name: "SoldDog",

  // A dogID can be passed in as a URL query so that the dog can be pre selected,
  // however this prop name has an underscore to prevent clashing from the actual dogID data variable
  props: ["_dogID"],

  components: { DogCard, Payment },

  computed: {
    // Need to trigger action to load dogs from API first
    ...mapState("dog", ["dogs"]),
    ...mapGetters("appointment", ["appointments"]),

    // @todo Load the dog using this.dogID after admin choose from the dropdown
    dog() {
      // Defaults to false so template logic can use the dog value with a v-if gaurd,
      // to only render UI that relies on properties of a dog object after dog object is loaded.
      return this.dogID ? this.dogs[this.dogID] : false;
    },

    users() {
      // By default the 'appointments' getters is already sorted by appointment time in ascending order
      // Thus the first one, which will be the default user selected in select element will be the 'current' appointment
      // Map all appointments into an object to use with the select element
      return this.appointments.map((appt) => ({
        id: appt.user,
        text: `${appt.lname} ${appt.fname}`,
      }));
    },
  },

  data() {
    return {
      // dogID defaults to the _dogID prop from router, _dogID is either a valid ID passed to router or undefined if none passed
      dogID: this._dogID,

      show: undefined,
      loggedIn: false,

      // Will be initialized in the created() hook as this value is initialized with the computed 'users' value
      userID: undefined,

      user: {
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
        address: undefined,
        postalCode: undefined,

        // Exists but not exposed to user to edit
        id: undefined,
      },
      buyer_ic: undefined,

      salePrice: undefined,
      deposit: undefined,

      // showSalesAgreement: true,
      showSalesAgreement: false,
      signaturePad: undefined,

      /* payment stuff */
      // Pre-generate the receipt number so that the same one can be accessed by both paylah QR and payment complete method
      receiptNumber: generateReceiptNumber(),

      showPaymentModal: false,
      paymentAmount: undefined,
      paymentMethod: undefined,
    };
  },

  created() {
    // Call action to ensure that all the dogs are loaded
    // @todo Not very efficient to reload all data again
    this.$store.dispatch("dog/getUnsoldDogs");
  },

  methods: {
    formatCurrency,

    switchUserView(view) {
      // Before switching the view, user should be logged out first,
      // so the user details wont continue to show even after switching to other user mode
      this.logout();

      this.show = view;
    },

    // Show sales agreement section and initialize the sales agreement signature pad
    async showSalesAgreementSection() {
      this.showSalesAgreement = true;

      // Create Signature Pad on created, as this cannot be done in data component since canvas is not yet created there
      const { default: SignaturePad } = await import("signature_pad");
      this.signaturePad = new SignaturePad(document.querySelector("canvas"));
    },

    async getSig() {
      if (this.signaturePad.isEmpty()) return alert("Missing Signature");

      if (
        !confirm(
          "I have read through and agree to the terms and condition of the Sales Agreement"
        )
      )
        return;

      // Convert signature drawing to dataURI to send to API
      const signatureDataURI = this.signaturePad.toDataURL();
      console.log("signatureDataURI ", signatureDataURI);

      this.showSalesAgreement = false;
    },

    async login(userID) {
      // If no userID passed in, assume it is login by number, so check if phone number is valid
      if (!userID && !this.user.number) return alert("Missing phone number");

      this.loading = true;

      // Call different API depending on whether a userID is passed in
      const res = await oof
        .GET(userID ? `/user/${userID}` : `/user/number/${this.user.number}`)
        .header(getAuthHeader)
        .runJSON();

      this.loading = false;

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Failed to login\nTry again?`) && this.login();

      this.user = res.user;
      this.userID = res.user.id;
      this.loggedIn = true;
    },

    logout() {
      // Hides the logged in user details card UI
      this.loggedIn = false;

      // Reset the userID so that the UI wont show the user after logging out
      this.userID = undefined;

      // Set number to undefined just in case the number is set already during login
      this.user.number = undefined;

      // Reset buyer_ic in case something is entered after login
      this.buyer_ic = undefined;

      // This resets the dropdown, only if the dropdown is rendered
      // Sets the value back to the default prompt option
      if (this.$refs.appointmentUserDropdown)
        this.$refs.appointmentUserDropdown.value = "defaultPrompt";
    },

    async paymentComplete() {
      // Convert to cents before sending back to API
      // Can convert to cents by multiplying by 100 directly as salePrice will be an int
      const price = parseInt(this.salePrice) * 100;

      const res = await oof
        .POST("/admin/pet/sold")
        .header(getAuthHeader)
        .data({
          userID: this.userID,
          receiptNumber: this.receiptNumber,
          paymentMethod: this.paymentMethod,

          // Items is generated and there is only 1 because a Dog Sale receipt will only have 1 item of that dog
          items: [
            {
              name: this.dog.breed,
              description: `Microchip Number: ${this.dog.mc}`,
              quantity: 1,

              price,
            },
          ],

          // Since there is only 1 item, the total price is therefore just the same price as that item
          totalPrice: price,
        })
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          this.paymentComplete()
        );

      alert("Sale processed!");

      // Might want to insert the sale data into store for a transactions view so it does not have to load from API again

      this.reset();
    },

    reset() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      Object.assign(this.$data, this.$options.data());

      // Reset scroll position to top too to allow admin to quickly enter a new manual sale
      window.scrollTo(0, 0);
    },
  },
};
</script>
