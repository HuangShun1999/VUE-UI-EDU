<template>
  <section class="login">
    <header>
      <h1>
        <router-link to="/" tabindex="-1">{{ name }}</router-link>
      </h1>
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
    </header>
    <el-form auto-complete="off" :model="model" :rules="rules" ref="login-form" label-position="top"
             :class="{ shaking: error }">
      <h2>Sign-in</h2>
      <el-form-item label="Login" prop="name">
        <el-input type="text" v-model="model.name" placeholder="Please enter name"/>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="model.password" placeholder="Please enter password"/>
      </el-form-item>
      <el-button type="primary" :loading="loading" @click="submit('login-form')">{{
          loading ? 'Loading...' : 'Login'
        }}
      </el-button>
    </el-form>
    <footer>
      ← Back to <a href="https://powernode.com">Powernode</a>
    </footer>
  </section>
</template>

<script>
import {login} from "@/api/user";
import {Message} from "element-ui";

export default {
  name: 'Login',

  data() {
    // form model
    // TODO: remove default values
    const model = {
      name: 'admin',
      password: '123456'
    }

    // form validate rules
    const rules = {
      name: [
        {required: true, message: '请输入用户名'},
        {
          min: 2,
          max: 16,
          message: 'Username must be between 2 and 16 characters'
        }
      ],
      password: [
        {required: true, message: '请输入密码'},
        {
          min: 4,
          max: 16,
          message: 'Password must be between 4 and 16 characters'
        }
      ]
    }

    const name = process.env.VUE_APP_NAME

    return {name, model, rules, error: null, loading: false}
  },

  methods: {
    submit(ref) {
      // form validate
      this.$refs[ref].validate(valid => {
        if (!valid) return false

        // validated
        this.error = null
        this.loading = true

        // create token from remote
        login(this.model).then(rsep=>{
          if(rsep.success){
            sessionStorage.setItem("userdata",rsep.content)
            this.$router.push("/")
          }else {
            Message.error(rsep.message);
          }
        })

      })

    }
  }
}
</script>

<style lang="scss">
.login {
  width: 95%;
  max-width: 22rem;
  margin: 1rem auto;

  header {
    margin-bottom: 1rem;

    h1 {
      margin: 4.5rem 0 3.5rem;
      text-align: center;
      letter-spacing: .1em;

      a {
        margin: 0;
        color: rgba(0, 0, 0, 0.5);
        font-size: 3rem;
        font-weight: 300;
        text-decoration: none;
        transition: text-shadow 0.3s;

        &:hover {
          text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  .el-form {
    margin-bottom: 2.5rem;
    padding: 1.875rem 1.25rem;
    background: #fff;

    h2 {
      margin: 0 0 1rem;
      font-weight: 400;
      font-size: 1.5rem;
    }

    .el-button {
      margin-top: 0.5rem;
      width: 100%;
    }

    &.shaking {
      animation: shakeX 1s;
    }
  }

  footer {
    margin-bottom: 1rem;
    padding: .625rem;
    border: .0625rem solid rgba(0, 0, 0, 0.1);
    font-size: .75rem;
    text-align: center;
    color: rgba(0, 0, 0, 0.6);

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  @keyframes shakeX {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate3d(-10px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
      transform: translate3d(10px, 0, 0);
    }
  }
}
</style>
