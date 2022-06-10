<template>
  <div class="text-center q-mt-md">
    <q-avatar style="height: 70px; width: 110px; margin-top: 20px">
      <img :src="`/img/Laptop.png`" />
    </q-avatar>
    <div class="text-h5 text-primary text-bold">
      Find 3 Closest Branches To:
    </div>
    <div>
      <q-input
        class="q-ma-lg text-h5"
        placeholder="enter current address"
        id="address"
        v-model="state.address"
      />
      <br />
    </div>
    <q-btn
      label="FIND 3"
      @click="genMap"
      class="q-mb-md text-bold"
      style="width: 30vw"
    />
    <div
      style="height: 50vh; width: 90vw; margin-left: 5vw; border: solid"
      ref="mapRef"
      v-show="state.showmap === true"
    ></div>
  </div>
</template>
<script>
import { ref, reactive } from "vue";
import { fetcher } from "src/utils/apiutil";
export default {
  name: "storedBranch",
  setup() {
    const mapRef = ref(null);
    let state = reactive({
      status: "",
      address: "",
      showmap: false,
      threeBranches: [],
    });
    const genMap = async () => {
      try {
        state.showmap = true;
        const tt = window.tt;
        let url = `https://api.tomtom.com/search/2/geocode/${state.address}.json?key=onbGqyYstDRZDIn424mzUapeOn5G7dYM`;
        let response = await fetch(url);
        let payload = await response.json();
        let lat = payload.results[0].position.lat;
        let lon = payload.results[0].position.lon;

        let map = tt.map({
          key: "onbGqyYstDRZDIn424mzUapeOn5G7dYM",
          container: mapRef.value,
          source: "vector/1/basic-main",
          center: [lon, lat],
          zoom: 8,
        });

        state.threeBranches = await fetcher(`branch/${lat}/${lon}`);

        state.threeBranches.forEach((branch) => {
          let marker = new tt.Marker()
            .setLngLat([branch.longitude, branch.latitude])
            .addTo(map);
          let popupOffset = 25;
          let popup = new tt.Popup({ offset: popupOffset });
          let distanceInKilo = branch.distance.toFixed(2) * 1.60934;
          popup.setHTML(
            `<div id="popup">Branch#: ${branch.id}</div><div>${
              branch.street
            }, ${branch.city}
<br/>${distanceInKilo.toFixed(2)} km</div>`
          );
          marker.setPopup(popup);
        });
      } catch (err) {
        state.status = err.message;
      }
    };
    return {
      mapRef,
      state,
      genMap,
    };
  },
};
</script>
