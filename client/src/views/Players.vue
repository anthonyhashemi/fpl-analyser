<template>
  <div>
    <div v-if="!hasPlayers" style="text-align: center">
      <br />
      <br />LOADING DATA...
    </div>
    <div v-if="!hasFiltered" style="text-align: center">
      <br />
      <br />NO PLAYERS MATCH FILTERS
    </div>
    <div v-if="hasPlayers" class="players">
      <h1>Players</h1>
      A table of all the FPL Players.
      <b-table
        striped
        hover
        :items="filtered"
        :fields="columns"
        :current-page="currentPage"
        :per-page="perPage"
      >
        <template slot="top-row" slot-scope="{ fields }">
          <td v-for="field in fields" :key="field.key">
            <input v-model="filters[field.key]" :placeholder="field.label" />
          </td>
        </template>
      </b-table>
      <b-row>
        <b-col md="6" class="my-1">
          <b-pagination
            :total-rows="totalRows"
            :per-page="perPage"
            v-model="currentPage"
            class="my-0"
          />
        </b-col>
        <b-col md="6" class="my-1">
          <b-form-group label="Per page" class="mb-0">
            <b-form-select :options="pageOptions" v-model="perPage" />
          </b-form-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PlayersService from "@/services/PlayersService";
export default {
  data() {
    return {
      perPage: 5,
      currentPage: 1,
      pageOptions: [5, 10, 15],
      players: [],
      filters: {}
    };
  },
  mounted() {
    this.getPlayers();
  },
  computed: {
    columns() {
      let columns = [];
      this.player_keys.forEach(function(key) {
        let column = {};
        column["key"] = key;
        column["sortable"] = true;
        columns.push(column);
      });
      return columns;
    },
    player_keys() {
      return Object.keys(this.players[0]).sort(function(b, a) {
        if (
          a.toLowerCase().includes("name") &&
          !b.toLowerCase().includes("name")
        ) {
          return 1;
        } else if (
          b.toLowerCase().includes("name") &&
          !a.toLowerCase().includes("name")
        ) {
          return -1;
        }
        return 0;
      });
    },
    empty_filtered() {
      let empty_filtered = [{}];
      this.player_keys.forEach(function(key) {
        empty_filtered[0][key] = "";
      });
      return empty_filtered;
    },
    filters() {
      let filters = {};
      this.player_keys.forEach(function(key) {
        return (filters[key] = "");
      });
      return filters;
    },
    filtered() {
      const filtered = this.players.filter(item => {
        return Object.keys(this.filters).every(key =>
          String(item[key])
            .toLowerCase()
            .includes(this.filters[key])
        );
      });
      return filtered.length > 0 ? filtered : this.empty_filtered;
    },
    hasPlayers() {
      return this.players.length > 0;
    },
    hasFiltered() {
      return this.filtered.length > 0;
    },
    totalRows() {
      return this.filtered.length;
    }
  },
  methods: {
    async getPlayers() {
      const response = await axios
        .get(`http://localhost:1337/players`)
        .then(response => {
          console.log(response);
          this.players = response.data.map(function(player) {
            delete player["id"];
            delete player["news_added"];
            delete player["news_return"];
            delete player["news_updated"];
            delete player["code"];
            delete player["added"];
            return player;
          });
        })
        .catch(error => {
          console.log("IT MESSED UP");
        });
    }
  }
};
</script>