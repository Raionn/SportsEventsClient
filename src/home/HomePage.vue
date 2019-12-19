<template>
  <div>
    <div class="text-center">
      <h1>Welcome, {{this.user.UserName}}!</h1>
    </div>
    <br />
    <em v-if="users.loading">Loading users...</em>
    <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>

    <ul class="list-group list-group-flush" v-if="sports.items">
      <li class="list-group-item" style="width: 500px;" v-for="sport in sports.items" :key="sport.Id">
        <div class="card" padding="10px">
          <img
            src="https://thumbs.dreamstime.com/b/basketball-football-volleyball-balls-vector-icons-sports-equipment-basketball-football-volleyball-balls-vector-icons-108173899.jpg"
            class="card-img-top"
          />

          <div class="card-header">{{sport.Name}}</div>

          <div class="card-body" v-if="events.items">
              Title
              <b>{{events.items.find(_event => _event.SportId === sport.Id).Name}}</b><br/>
              City:
              <b>{{events.items.find(_event => _event.SportId === sport.Id).City}}</b><br/>
              Participants:
              <ul class="list-group" v-if="event=events.items.find(_event => _event.SportId === sport.Id)">
                <li class="list-group-item" v-for="userId in event.ParticipantIds" :key="userId">
                  <div class="row">
                    <div style="width: 250px;"> {{users.items.find(_user => _user.Id === userId).UserName}} </div>
                    <div class="col-sm" v-if="users.items">                    
                      <button
                        class="btn btn-primary"
                        style="width: 80px;"
                        v-on:click="kick(event.Id, userId)"
                        >Remove
                      </button>  
                    </div>
                  </div>
                </li>
              </ul>
            <div class="card-action" v-if="!event.ParticipantIds.includes(user.Id)">
              <br/>
              <button class="btn btn-primary" style="width: 70px;" v-on:click="join(event.Id)">Join</button>
            </div>                 
            <!-- </p> -->
          </div>
        </div>
      </li>
    </ul>

    <br/>
    <p>
      <router-link to="/login">Logout</router-link>
    </p>
  </div>
</template>

<script>
import { authHeader } from "../_helpers";
import config from "config";

export default {
  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    users() {
      return this.$store.state.users.all;
    },
    events() {
      return this.$store.state.events.all;
    },
    sports() {
      return this.$store.state.sports.all;
    }
  },
  methods: {
    log(message) {
      console.log(message);
    },
    join(eventId, userId) {
      let event = this.events.items.find(_event => _event.Id === eventId);

      if (!event.ParticipantIds.includes(this.user.Id)) {
        event.ParticipantIds.push(this.user.Id);

        const requestOptions = {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify(event)
        };

        console.log(requestOptions);

        fetch(`${config.apiUrl}/api/events/${event.Id}`, requestOptions);
      }
    },
    kick(eventId, userId) {
      let event = this.events.items.find(_event => _event.Id === eventId);

      event.ParticipantIds = event.ParticipantIds.filter(_id => _id !== userId);

      const requestOptions = {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(event)
      };

      fetch(`${config.apiUrl}/api/events/${event.Id}`, requestOptions);
    }
  },
  created() {
    this.$store.dispatch("users/getAll");
    this.$store.dispatch("events/getAll");
    this.$store.dispatch("sports/getAll");
  }
};
</script>