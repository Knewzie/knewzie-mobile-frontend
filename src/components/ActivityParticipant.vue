<template>
  <div class="participant-info">
    <div>
      <span class="participant">{{ title }}({{avatarNum}})</span>              
    </div>
    <div class="participant-avator-item">
      <div class="participant-avator" v-for="(users,index) in this.avatarArr" :key="index">   
        <div class="participant-avator-item" v-for="(user,idx) in users" :key="idx">         
          <Avatar :avatar="user.avatar" :role="user.role" :id="user.uid" />
          <div><span class="certificate-info"></span></div>    
        </div>   
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Avatar from './Avatar'

export default {
  name: 'ActivityParticipant',
  components: {
    // eslint-disable-next-line
    RingLoader, Avatar
  },
  props: {
    title: String,
    avatarArr:Array,
    avatarNum: Number
  },
  data() {
      return {
          currentRelationship: this.relationship,
          loading: false,
      }
  },
  watch: {
      relationship(newV) {
          this.currentRelationship = newV;
      }
  },
  computed: {
    followedClass()  {
        let clazz = this.currentRelationship === 0 ? "to-follow follow-box" : "followed follow-box";
        if (this.loading) {
            clazz += " loading";
        }
        return clazz;
    },
    certificatedClass () {
      let returnClass = "certificate-box";
      switch (this.role) {
        case 2: {
          returnClass += " enterprise"
          break;
        }
        case 3: {
          returnClass += " organization"
          break;
        }
        case 4: {
          returnClass += " vip"
          break;
        }
        case 5: {
          returnClass += " certificated"
          break;
        }
      }
      return returnClass;
    }
  },
  methods: {
      async follow () {
          try {
            this.loading = true;
            await axios.post(`/user/follow`, { toUid: this.id });
            let relationship = this.currentRelationship;
            this.currentRelationship = relationship === 0 ? 1 : 0;
          } catch(e) {
            console.error(e);
          } finally {
            this.loading = false;
          }
      }
  }
}
</script>

<style>
.v-spinner > .v-ring {
    margin: 0 auto;
}

.v-ring {
    box-sizing: border-box;
}

</style>

<style scoped>

.avatar-box {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    align-items: left;
    border-bottom: 1px solid #E6E6E7;
}

.participant-info {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  align-items: left;
  border-bottom: 1px solid #E6E6E7;
}

.participant-avator {
  display: flex;
  flex-direction: row;
  align-items: left;
}

.participant-avator-item {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.participant {
  font-size: 16px;
  font-weight: bold;
}


.certificate-info {
  display: inline-block;
  margin-left: 0px;
  color: rgba(0,0,0, 30%);
  font-size: 12px;
}

.info {
  color: black;
  flex: 1;
}

.info h4 {
  display: inline-block;
}

.info abbr {
  display: block;
  font-size: 12px;
  color: rgba(0, 0, 0, 60%)
}

.loading-box {
    width: 48px;
    height: 25px;
    text-align: center;
}
h4 {
    margin: 0;
}

a.follow-box {
    box-sizing: border-box;
    width: 48px;
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 12px;
    text-align: center;
    margin-left: 5px;
    border: 1px solid #8DCF44;
}

a.loading {
    display: none;
}

a.followed {
    background-color: #8DCF44;
    color: white;
}

a.to-follow {
    color: #8DCF44;
}
</style>
