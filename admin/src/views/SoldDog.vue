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
            <a @click="show = 'a'">Appointment</a>
          </li>
          <li :class="{ 'is-active': show === 'w' }">
            <a @click="show = 'w'">Walk In</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="column is-full" v-if="show === 'a'">
      <b>Sold to</b>

      <!-- Dropdown showing list of names of all users who have a appointment today -->
      <div class="select is-fullwidth">
        <select v-on:change="(event) => (userID = event.target.value)">
          <option hidden disabled selected value>Please select a user</option>

          <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
          <!-- v-for="user in users" -->
          <option
            v-for="user in [{ id: 1, text: 'test' }]"
            :value="user.id"
            :key="user.id"
            :selected="user.id === userID"
          >
            {{ user.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="column is-full" v-if="show === 'w'">
      <div class="columns" v-if="!loggedIn">
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
                  @keypress.enter="login"
                />
              </div>
              <div class="control">
                <button class="button is-success" @click="login">Login</button>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Show user details once logged in for user to review, and to go edit details if needed -->
      <div v-else class="column is-full box">
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
            <button class="button is-light is-danger" @click="loggedIn = false">
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
        </div>
      </div>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <label>
        <b>Which dog?</b>
        <br />

        <!-- @todo Show the card like in Dog.vue -->
        <div v-if="dog">
          <p class="subtitle is-3">{{ dog.name }}</p>
        </div>

        <div v-else class="select is-fullwidth">
          <select>
            <option v-for="(dog, i) in dogs" :key="i">{{ dog.name }}</option>
          </select>
        </div>
      </label>
    </div>

    <!-- Only show sale price input after dog object has been loaded/selected  -->
    <div class="column is-full" v-if="dog && dog.msrp">
      <label>
        <!-- 
          Show MSRP without auto fill to force admin to type it out again
          Then if differs from MSRP, warn user before allowing them to proceed
          This is to prevent user from just clicking sold without updating the price if it has change after negotiation
        -->
        <b>Final sale price</b> (MSRP is {{ formatCurrency(dog.msrp) }})
        <br />
        <p v-if="salePrice * 100 < dog.msrp">*Less than MSRP</p>
        <p v-if="salePrice * 100 > dog.msrp">*More than MSRP</p>

        <input
          type="number"
          v-model="salePrice"
          pattern="[\s0-9]+"
          placeholder="E.g. 10000 for $10,000 where unit is dollars"
          class="input"
          :class="{
            'is-danger': salePrice * 100 < dog.msrp,
            'is-warning': salePrice * 100 > dog.msrp,
          }"
        />
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
        Continue
      </button>
    </div>

    <div class="column is-full" v-if="showSalesAgreement">
      <div class="columns is-multiline is-vcentered box">
        <p class="title">Sales Contract</p>

        <div class="column is-full">
          <b>Contract Parties</b>
          <br />

          The Contract is entered into between Ministry of Pup LLP and the Buyer
          <b>{{ buyer_name }}</b>
          , NRIC <b>{{ buyer_ic }}</b> in respect of the purchase of the
          following pet as indicated below, on the terms and conditions stated
          in this Contract. Details of the livestock sold is stated below:
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
                <td>{{ dog.mcnumber }}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>{{ dog.dob }}</td>
              </tr>
              <tr>
                <td>Purchase Price</td>
                <td>${{ salePrice }}</td>
              </tr>
              <!-- @todo Should we still add deposit here?? -->
              <tr>
                <td>Deposit</td>
                <td>${{ salePrice }}</td>
              </tr>
              <tr>
                <td>Pedigree</td>
                <td>{{ dog.pedigree }}</td>
              </tr>
              <tr>
                <td>HDB Approved</td>
                <td>{{ dog.hdb }}</td>
              </tr>
              <tr>
                <td>Country of Import</td>
                <td>{{ dog.country }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="column is-full content">
          <p class="subtitle">Conditions of Sale</p>
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
              to either (I) refund only the purchased price upon the return of
              the Dog; (ii)exchange for another dog of same different breed or
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
            <a href="https://ministryofpup.com/dpn.pdf" target="_blank">
              Privacy & Data Policy
            </a>
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
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import formatCurrency from "../utils/formatCurrency.js";

export default {
  name: "SoldDog",

  props: ["dogID"],

  computed: {
    // If a dogID is passed in as a URL query
    // @todo Load the dog using this.dogID after admin choose from the dropdown
    dog() {
      return this.dogID ? this.$store.state.dog?.dogs[this.dogID] : undefined;
      // return this.dogID
      //   ? this.$store.state.dog.dogs[this.dogID]
      //   : { msrp: 1000000 };
    },

    // Need to trigger action to load dogs from API first
    ...mapState("dog", ["dogs"]),
    ...mapGetters("appointment", ["appointments"]),

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

      salePrice: undefined,

      /* Paynow QR code values */
      showModal: false,
      imageDataURI: undefined,

      // showSalesAgreement: false,
      showSalesAgreement: true,
      signaturePad: undefined,

      // @todo Temporary values to test out the UI
      buyer_name: "test",
      buyer_ic: "T0000000Z",
      dog: {
        name: "pedro",
        mcnumber: 900234681375910,
        breed: "French Bulldog",
        sex: "Male",
        dob: "1st Dec 2021",
        pedigree: true,
        hdb: false,
        country: "UK",
      },
    };
  },

  created() {
    this.userID = this.users[0]?.id;

    // @todo Call action to ensure that all the dogs are loaded

    // Show the sales agreement section and initialize the sales agreement signature pad
    this.showSalesAgreementSection();
  },

  methods: {
    formatCurrency,

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
      const signatureString = this.signaturePad.toDataURL();
      console.log("signatureString ", signatureString);

      this.showSalesAgreement = false;
    },

    async login(userID) {
      // TMP setting this to only allow login using phone number
      userID = undefined;

      if (!this.user.number) return alert("Missing phone number");

      this.loading = true;

      // Call different API depending on whether a userID is passed in
      const res = await oof
        .GET(userID ? `/user/${userID}` : `/user/number/${this.user.number}`)
        .header(await getAuthHeader())
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

    async showPaynowQR() {
      const { default: PaynowQR } = await import("paynowqr");

      // The QR Code should only be valid until tmr
      // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds = 86400000 milliseconds
      const d = new Date(new Date().getTime() + 86400000);
      const month = d.getMonth() + 1;
      const pmonth = month > 9 ? month : `0${month}`; // Month with 0 padding
      const date = d.getDate();
      const pdate = date > 9 ? date : `0${date}`; // Date with 0 padding
      const expiryDate = `${d.getFullYear()}${pmonth}${pdate}`;

      //Create a PaynowQR object
      const paynowQRCode = new PaynowQR({
        // Required: UEN of company, hard coded in as it will not be changed
        uen: "T17LL2360H",

        // Specify amount of to pay, this is just the amount keyed in
        amount: this.salePrice,

        // Set an expiry date for the Paynow QR code (YYYYMMDD, e.g. "20211231")
        // If omitted, defaults to 5 years from current time.
        expiry: expiryDate,

        // @todo Call and API to generate a invoice reference number to track later (possibly have the paynow bank app on the ipad)
        // Reference number for Paynow Transaction. Useful if you need to track payments for recouncilation.
        refNumber: "MOP-INV-1001",

        // company: "ACME Pte Ltd.", // Company name to embed in the QR code. Optional.
      });

      const QRCode = await import("qrcode");

      // Generate the QR code image data URL and set onto component data value
      this.imageDataURI = await QRCode.toDataURL(
        // Generate UTF-8 string from the qrcode to generate the QR code data URL for the image tag
        paynowQRCode.output(),

        // Use high error resistance rate of ~ 30%
        { errorCorrectionLevel: "H" }
      );

      // Open up modal to show the QR Code image
      this.showModal = true;
    },

    async sold() {
      //
      // await this.showPaynowQR();

      this.$router.push({
        name: "payment",
        params: {
          redirect: { name: "sold-dog" },
        },
      });

      // Convert to cents before sending back to API
      this.salePrice * 100;
    },
  },
};
</script>
