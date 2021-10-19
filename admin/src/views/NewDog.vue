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
          <select v-on:change="updateDogTypeID($event)">
            <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
            <option
              v-for="dogType in dogTypes"
              :value="dogType.id"
              :key="dogType.id"
              :selected="dogType.id === dogTypeID"
            >
              {{ dogType.text }}
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
          <select v-on:change="updateDogSexID($event)">
            <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
            <option
              v-for="dogSex in dogSexes"
              :value="dogSex.id"
              :key="dogSex.id"
              :selected="dogSex.id === dogSexID"
            >
              {{ dogSex.text }}
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
          v-model="mcNumber"
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
        <b>Copy Writing</b>

        <!-- @todo Make textarea grow automatically -->
        <textarea
          v-model="copyWriting"
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
        <b>Cost of dog</b>
        <br />
        *How much did you pay for this dog / Inventory cost

        <input
          type="number"
          v-model="cost"
          pattern="[\s0-9]+"
          min="0"
          placeholder="E.g. 10000 for $10,000"
          class="input"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>MSRP</b>
        <br />
        *How much do you plan to sell this dog for?

        <!-- Needs to be more than the cost of dog -->
        <input
          type="number"
          v-model="msrp"
          pattern="[\s0-9]+"
          :min="cost"
          placeholder="E.g. 10000 for $10,000"
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

      // Should this be a Int ID, or something like either "M" or "F"?
      dogSexID: 1,
      dogSexes: [
        { id: 1, text: "Male" },
        { id: 2, text: "Female" },
      ],

      name: undefined,
      copyWriting: undefined,
      mcNumber: undefined,
      pedigree: false,
      cost: undefined,
      msrp: undefined,

      // @todo Can be taken from DB if needed
      dogTypeID: 1,
      dogTypes: [
        { id: 1, text: "French bulldog" },
        { id: 2, text: "Shiba Inu" },
      ],

      // Files array and firebase cloud storage values
      files: [],
      folderID: undefined,
      imagePath: undefined,
    };
  },

  methods: {
    updateDogTypeID(event) {
      // ID is int, but if set as value of option element, it will be auto converted into String, thus parseInt back to int before saving it
      // If not converted before saving, tripTypeID would become a string and UI will show as edited because "1" !== 1
      this.dogTypeID = parseInt(event.target.value);
    },

    updateDogSexID(event) {
      // ID is int, but if set as value of option element, it will be auto converted into String, thus parseInt back to int before saving it
      // If not converted before saving, tripTypeID would become a string and UI will show as edited because "1" !== 1
      this.dogSexID = parseInt(event.target.value);
    },

    async generateDogName() {
      // Only asynchronously load the package if user wants to generate a random name
      const dogNames = await import("dog-names");
      this.name =
        this.dogSexID === 1 ? dogNames.maleRandom() : dogNames.femaleRandom();
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
      const folderID =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2);

      this.folderID = folderID;

      const storage = getStorage(firebaseApp);

      // If this fails, let report method that calls this internal method handle it
      this.imagePath = await Promise.all(
        this.files.map((file) =>
          // Upload file and chain to get publicly available download URL
          uploadBytes(
            ref(storage, `dog-pics/${folderID}/${file.name}`),
            file
          ).then((snapshot) => getDownloadURL(snapshot.ref))
        )
      );

      console.log(`${this.files.length} files uploaded`);
    },

    async newDog() {
      // @todo Validate all required input is entered

      // Ensure files are successfully uploaded first before calling API
      // If this succeeds, but API call fails then the files are just left in storage
      // If user chooses to retry, on the next recursive call, the upload files step will be skipped
      if (this.folderID === undefined && this.imagePath === undefined)
        await this._uploadFiles();

      // eslint-disable-next-line no-unreachable
      const res = await oof
        .POST("/admin/pet/new")
        .header(await getAuthHeader())
        .data({
          folderID: this.folderID,
          imagePath: this.imagePath,

          availablityDate: this.availablityDate,
          dob: this.dob,
          dogSexID: this.dogSexID,
          name: this.name,
          copyWriting: this.copyWriting,
          mcNumber: this.mcNumber,
          pedigree: this.pedigree,
          dogTypeID: this.dogTypeID,
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
    },
  },
};
</script>
