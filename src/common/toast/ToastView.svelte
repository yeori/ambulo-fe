<script lang="ts">
  import { fly } from 'svelte/transition'
  // @ts-ignore
  import { ToastType, messages } from './index.ts'
  import ActionIcon from '@common/ActionIcon.svelte'
  import AppIcon from '@common/AppIcon.svelte'
  // let messages = []
  // toast.watch((_messages) => {
  //   messages = _messages
  // })
  const icons = {
    INFO: { name: 'info', bgcolor: '#2b2c3a' },
    WARN: { name: 'warn', bgcolor: '#2b2c3a' },
    ERROR: { name: 'error', bgcolor: 'white' }
  }
</script>

<div class="toast-wrapper">
  {#each $messages as toast (toast.seq)}
    <div class="toast-elem" transition:fly={{ x: -340, duration: 150 }}>
      {#if toast.type === ToastType.EMBED}
        <section>
          <svelte:component
            this={toast.component}
            on:close={() => toast.hideNow()}
          />
        </section>
      {:else}
        <span
          class="no-user-select {icons[toast.type]
            .name} {toast.type.toLowerCase()}-toast toast-icon"
          ><AppIcon icon={icons[toast.type].name} color={'white'} /></span
        >
        <section>
          {#if toast.hasTitle()}
            <h5>{toast.title}</h5>
          {/if}
          <ul>
            {#each toast.bodies as body}
              <li><span>{body}</span></li>{/each}
          </ul>
        </section>
      {/if}
      <span>
        <ActionIcon
          icon="close"
          color="white"
          on:click={() => toast.hideNow()}
        />
      </span>
    </div>
  {/each}
</div>

<style lang="scss">
  .toast-wrapper {
    --toast-margin: 18px;
    --toast-gap: 16px;
    --toast-fsize: 1rem;
    --toast-border-radius: 8px;
    position: fixed;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    left: var(--toast-margin);
    bottom: var(--toast-margin);
    width: 340px;
    font-size: var(--toast-fsize);
    .toast-elem {
      display: inline-flex;
      background-color: #2b2c3a;
      color: white;
      font-size: inherit;
      font-weight: 300;
      border-radius: var(--toast-border-radius);

      .toast-icon {
        font-size: 18px;
        // padding: var(--toast-gap);
        user-select: none;
        border-top-left-radius: var(--toast-border-radius);
        border-bottom-left-radius: var(--toast-border-radius);
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 8px;
        &.info {
          background-color: #45b0ff;
          color: #45b0ff;
          // color: var(--ssda-color-blue-900);
        }
        &.error {
          background-color: red;
        }
        &.warn {
          background-color: orange;
        }
      }
      section {
        padding: var(--toast-gap);
        flex: 1 1 auto;
        h5 {
          font-size: 1.1em;
          font-weight: 400;
          margin-bottom: 6px;
        }
        ul {
          font-size: 1em;
          list-style: none;
          padding: 0;
        }
      }
      .toast-close {
        cursor: pointer;
      }
    }
    & > .toast-elem + .toast-elem {
      margin-top: var(--toast-gap);
      & > :global(.close) {
        padding: 8px;
      }
    }
  }
</style>
