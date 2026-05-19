<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧 -->
      <div class="login-brand">
        <div class="brand-icon">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="4" width="24" height="20" rx="3" />
            <path d="M8 10h12M8 15h8M8 20h10" stroke-linecap="round" />
          </svg>
        </div>
        <h1 class="brand-title">个人笔记</h1>
        <p class="brand-subtitle">简洁 · 专注 · 有条理</p>
      </div>

      <!-- 右侧 -->
      <div class="login-form-section">
        <div class="form-card">
          <h2 class="form-title">登录</h2>
          <p class="form-subtitle">欢迎回来，请登录你的账号</p>

          <a-form
            ref="formRef"
            :model="formState"
            :rules="formRules"
            @finish="handleFinish"
          >
            <a-form-item name="username">
              <a-input
                v-model:value="formState.username"
                placeholder="用户名"
                size="large"
              >
                <template #prefix>
                  <UserOutlined style="color: var(--color-text-muted)" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password">
              <a-input-password
                v-model:value="formState.password"
                placeholder="密码"
                size="large"
              >
                <template #prefix>
                  <LockOutlined style="color: var(--color-text-muted)" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item name="captcha">
              <div class="captcha-group">
                <a-input
                  v-model:value="formState.captcha"
                  placeholder="验证码"
                  size="large"
                  class="captcha-input"
                >
                  <template #prefix>
                    <SafetyOutlined style="color: var(--color-text-muted)" />
                  </template>
                </a-input>
                <div class="captcha-code" @click="refreshCaptcha">
                  {{ captchaCode }}
                </div>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" size="large" block>
                登录
              </a-button>
            </a-form-item>
          </a-form>

          <div class="form-footer">
            <span class="form-hint">体验账号：admin / 123456</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons-vue';
  import { type FormInstance, message } from 'ant-design-vue';
  import to from 'await-to-js';
  import { onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { authApi } from '@/api/modules/auth';
  import { HOME_URL } from '@/config';
  import { useUserStore } from '@/store/modules/user';

  const router = useRouter();
  const userStore = useUserStore();

  const formRef = ref<FormInstance>();
  const loading = ref(false);
  const captchaCode = ref<string>('C5DU');

  const formState = reactive({
    username: '',
    password: '',
    captcha: ''
  });

  const formRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
    ],
    captcha: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { len: 4, message: '验证码为4位', trigger: 'blur' }
    ]
  };

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaCode.value = code;
  };

  const handleFinish = async (form: any) => {
    if (form.captcha !== captchaCode.value) {
      message.error('验证码错误');
      refreshCaptcha();
      return;
    }
    loading.value = true;
    const [err, res] = await to(authApi.login({ username: form.username, password: form.password }));
    loading.value = false;
    if (err) {
      message.error('登录失败，请重试');
      return;
    }
    message.success('登录成功');
    userStore.setUserInfo(res);
    userStore.setLoginStatus(true);
    router.replace(HOME_URL);
  };

  onMounted(() => {
    refreshCaptcha();
  });
</script>

<style lang="scss" scoped>
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f8f9fa 0%, #eef1f5 100%);
  }

  .login-container {
    display: flex;
    width: 840px;
    min-height: 480px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  // 左侧品牌区
  .login-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 48px;
    background: linear-gradient(135deg, #f0faf8 0%, #e8f5f2 100%);

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      color: var(--color-primary);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(61, 155, 143, 0.1);
      margin-bottom: 20px;
    }

    .brand-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 14px;
      color: var(--color-text-muted);
      letter-spacing: 0.05em;
    }
  }

  // 右侧表单
  .login-form-section {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    padding: 48px;

    .form-card {
      width: 100%;
      max-width: 320px;

      .form-title {
        font-size: 22px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 4px;
      }

      .form-subtitle {
        font-size: 14px;
        color: var(--color-text-muted);
        margin-bottom: 28px;
      }

      .captcha-group {
        display: flex;
        gap: 10px;

        .captcha-input {
          flex: 1;
        }

        .captcha-code {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 90px;
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: 3px;
          cursor: pointer;
          user-select: none;
          background: var(--color-primary-light);
          border-radius: 6px;
          transition: all 0.15s;

          &:hover {
            background: rgba(61, 155, 143, 0.15);
          }
        }
      }

      .form-footer {
        margin-top: 16px;
        text-align: center;

        .form-hint {
          font-size: 12px;
          color: var(--color-text-muted);
        }
      }
    }
  }
</style>
