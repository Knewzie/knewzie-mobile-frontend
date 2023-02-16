<template>
	<div id="app">
		<div class="topBar">
			<div class="topLogo"><img class="logo" src="/img/logo.png" /></div>
			<div class="topBtn">
				<a v-on:click="download"><span class="topBtnText">下载App</span></a>
			</div>
		</div>

	</div>
</template>

<script>
	// import axios from "axios";
	//import Article from "../../components/ShowVideo.vue";


	export default {
		name: "User",
		components: {
			// Article,
		},
	}
</script>

<style>
	.topBar {
		background-color: #6599ff;
		height: 60px;
		width: 100%;
		position: fixed;
		z-index: 10;
	}

	.topLogo {
		top: 6px;
		left: 17px;
		position: absolute;
	}

	.logo {
		width: 100px;
		object-fit: cover;
		pointer-events: visible;
	}

	.topBtn {
		border-radius: 100px;
		padding: 4px 12px;
		background-color: white;
		position: absolute;
		top: 15px;
		right: 28px;
	}

	.topBtnText {
		font-family: SourceHan Sans CN-Medium;
		font-size: 14px;
		font-weight: 400;
		color: #59a1ff;
	}

	body {
		margin: 0;
		-webkit-touch-callout: none;
		padding-bottom: env(safe-area-inset-bottom);
		background: #f6f6f6;
	}

	article {
		color: black;
	}
</style>

