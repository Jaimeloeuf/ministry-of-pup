<template>
  <div class="columns is-multiline is-centered" style="max-width: 30em">
    <div class="column is-full">
      <label>
        <b>Dog availablity date</b>

        <input
          class="input"
          type="date"
          :min="today"
          v-model="availablityDate"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Date of Birth</b>

        <input class="input" type="date" :max="today" v-model="dob" />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Breed</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="(event) => (breed = event.target.value)">
            <option
              v-for="dogBreed in breeds"
              :value="dogBreed"
              :key="dogBreed"
              :selected="dogBreed === breed"
            >
              {{ dogBreed }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Sex</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="(event) => (sex = event.target.value)">
            <!-- Value must be id so that when parsing value in @change handler above it can get id instead of text -->
            <option
              v-for="sex in dogSexes"
              :value="sex.id"
              :key="sex.id"
              :selected="sex.id === sex"
            >
              {{ sex.text }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Name</b>

        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              type="text"
              v-model="name"
              placeholder="E.g. Mochi"
              required
              class="input"
            />
          </div>
          <div class="control">
            <button class="button" @click="generateDogName">Generate</button>
          </div>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Microchip number</b>
        <br />
        *Use scanner

        <input
          type="number"
          v-model="mc"
          pattern="[\s0-9]+"
          min="99999999999999"
          max="999999999999999"
          placeholder="E.g. 123456789012345"
          class="input"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Description</b>

        <!-- @todo Make textarea grow automatically -->
        <textarea
          v-model="description"
          class="textarea"
          placeholder="Describe this dog!"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <input type="checkbox" v-model="pedigree" />
        Pedigree
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Country of import</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="(event) => (originCountry = event.target.value)">
            <option
              v-for="country in countries"
              :value="country"
              :key="country"
              :selected="country === originCountry"
            >
              {{ country }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <input type="checkbox" v-model="hdbApproved" />
        HDB approved?
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Dog Color</b>
        <br />
        *Copy exactly the full color name from the certificate

        <input
          type="text"
          v-model="color"
          placeholder="E.g. Blue Tan"
          class="input"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Cost of dog</b>
        <br />
        *How much did you pay for this dog / Inventory cost

        <input
          type="number"
          v-model="cost"
          pattern="[\s0-9]+"
          min="0"
          placeholder="E.g. 10000 for $10,000 where unit is dollars"
          class="input"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>SRP</b> Suggested Retail Price
        <br />
        *How much do you plan to sell this dog for?

        <!-- Needs to be more than the cost of dog -->
        <input
          type="number"
          v-model="srp"
          pattern="[\s0-9]+"
          :min="cost"
          placeholder="E.g. 10000 for $10,000 where unit is dollars"
          class="input"
        />
      </label>
    </div>

    <div v-if="files.length" class="column is-full">
      <label>
        <b>Images / Videos</b>

        <table class="table is-striped is-fullwidth is-vcentered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(file, i) in files"
              :key="i"
              :class="{ 'is-selected': false }"
            >
              <td>{{ file.name }}</td>
              <td>
                <!-- <button @click="deleteFile(i)" class="delete" /> -->
                <button
                  @click="deleteFile(i)"
                  class="button is-danger is-light is-fullwidth"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </label>
    </div>

    <!-- Allow users to upload up to 10 pictures/videos as needed -->
    <div class="column is-full">
      <label v-if="files.length < 10">
        <b>Max 10 files</b>

        <div class="file">
          <label class="button is-light is-success is-fullwidth">
            <p>Select images / videos</p>

            <input
              type="file"
              accept="video/*,image/*"
              multiple
              @change="onFileChange"
              class="file-input"
              name="images"
            />
          </label>
        </div>
      </label>

      <div v-else>
        <b>
          You have uploaded a maximum of 10 files already, please delete files
          to add more
        </b>
      </div>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button @click="newDog" class="button is-light is-fullwidth is-success">
        Add Dog
      </button>
    </div>

    <div class="column is-full">
      <button @click="reset" class="button is-light is-fullwidth is-danger">
        Reset form
      </button>
    </div>
  </div>
</template>

<script>
import todaysDate from "../utils/todaysDate.js";
import { oof } from "simpler-fetch";
import { firebaseApp, getAuthHeader } from "../firebase.js";

export default {
  name: "NewDog",

  data() {
    const today = todaysDate();

    return {
      today,
      availablityDate: today,
      dob: today,

      sex: "m",
      dogSexes: [
        { id: "m", text: "Male" },
        { id: "f", text: "Female" },
      ],

      name: undefined,
      description: undefined,
      mc: undefined,
      pedigree: false,
      hdbApproved: false,
      color: undefined,
      cost: undefined,
      srp: undefined,

      // @todo Take from DB? Or manually add and embed here?
      // Breed defaults to the first element of breeds array, MOP also primarily sell French Bulldogs
      breed: "French Bulldog",
      breeds: [
        "French Bulldog",
        "Shiba Inu",
        "Mame Shiba Inu",
        "Pug",
        "Cockapoo",
        "Pomeranian",
        "Poodle",
      ],

      // To manually update/add as new dogs of different country of origins are sourced
      originCountry: "UK",
      countries: ["UK", "Japan", "Australia"],

      // Files array and firebase cloud storage values
      files: [],
      imgFolder: undefined,
      imgSrc: undefined,
    };
  },

  methods: {
    async generateDogName() {
      // Only asynchronously load the package if user wants to generate a random name
      const dogNames = await import("dog-names");
      this.name =
        this.sex === "m" ? dogNames.maleRandom() : dogNames.femaleRandom();
    },

    deleteFile(fileIndex) {
      this.files.splice(fileIndex, 1);
    },

    // Concat list of uploaded file objects to the existing array of files
    onFileChange(event) {
      // Dont add files to file array if the total number of files after upload is more than 10
      if (this.files.length + event.target.files.length > 10)
        return alert(
          `Maximum of 10 files allowed\nThere is already ${this.files.length} file(s)`
        );

      // Need to use push instead of concat as Vue's reactivity does not work with concat
      this.files.push(...event.target.files);
    },

    // Upload files to a new random folder in dog-pics/ and return's the folder ID if there are files, else returns null
    async _uploadFiles() {
      if (!this.files.length) return null;

      // Lazily import this to quickly load the page first
      const { getStorage, ref, uploadBytes, getDownloadURL } = await import(
        "firebase/storage"
      );

      // Firebase cloud storage does not provide auto GUID generation, thus here is a crud way of generating GUIDs
      // https://stackoverflow.com/questions/37444685/store-files-with-unique-random-names/37444839#37444839
      const imgFolder =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2);

      this.imgFolder = imgFolder;

      const storage = getStorage(firebaseApp);

      // If this fails, let report method that calls this internal method handle it
      this.imgSrc = await Promise.all(
        this.files.map((file) =>
          // Upload file and chain to get publicly available download URL
          uploadBytes(
            ref(storage, `dog-pics/${imgFolder}/${file.name}`),
            file
          ).then((snapshot) => getDownloadURL(snapshot.ref))
        )
      );

      console.log(`${this.files.length} files uploaded`);
    },

    async newDog() {
      // @todo Validate all required input is entered

      // @todo Test to ensure this works
      // Ensure files are successfully uploaded first before calling API
      // If this succeeds, but API call fails then the files are just left in storage
      // If user chooses to retry, on the next recursive call, the upload files step will be skipped
      if (this.imgFolder === undefined && this.imgSrc === undefined)
        await this._uploadFiles();

      const res = await oof
        .POST("/admin/pet/new")
        .header(getAuthHeader)
        .data({
          imgFolder: this.imgFolder,
          imgSrc: this.imgSrc,

          availablityDate: this.availablityDate,
          dob: this.dob,
          sex: this.sex,
          name: this.name,
          description: this.description,
          mc: this.mc,
          pedigree: this.pedigree,
          breed: this.breed,
          hdbApproved: this.hdbApproved,
          originCountry: this.originCountry,
          color: this.color,

          // HTML input type="number" returns a String, thus parseInt to Number and * 100 to convert to cents
          // Cost and SRP of dog will not be floats as everything is stored in cents in the backend
          cost: parseInt(this.cost) * 100,
          srp: parseInt(this.srp) * 100,
        })
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.newDog();

      alert("Dog added!");

      // Insert this dog's data into vuex store so that it can be seen immediately when switching to AllDogs view
      // res.dogID;

      // Reset the page once a new dog is added
      this.reset();
    },

    reset() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      Object.assign(this.$data, this.$options.data());

      // Only use this if `this` is used in the data method
      // Object.assign(this.$data, this.$options.data.apply(this));

      // Reset scroll position to top too to allow admin to quickly enter a new manual sale
      window.scrollTo(0, 0);
    },
  },
};
</script>
