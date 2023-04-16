<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    let time;

    dispatch('message', time);

</script>

<button>&lt;</button>