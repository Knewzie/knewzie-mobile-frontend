<template>
	<div id="app">
		<div class="topBar">
			<div class="topLogo"><img class="logo" src="/img/logo.png" /></div>
			<div class="topBtn">
				<a v-on:click="download"><span class="topBtnText">下载App</span></a>
			</div>
		</div>
		<div class="profile">
			<div class="avatar-row">
				<div class="avatar" style="margin-right: 20px; height: 68px;">
					<img style="width: 68px;height: 68px; border-radius: 40px;" :src="user.avatar"/>
				</div>
				<div style="display: flex; flex-direction: column; justify-content: space-around; align-items: flex-start; height: 68px;">
					<div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
						<div style="font-size: 20px; font-weight: 600;">{{user.nickname}}</div>
						<div style="margin-left: 12px; height:20px; width: 20px; display: flex; justify-content: center; align-items: center; background-color: #051A37; border-radius: 10px;">
							<img  src="../../images/bx-buildings.png" style="width: 10px; height: 10px;" />
						</div>
					</div>

					<div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
						<div class="avatar-row-follow">
							<div><img src="../../images/ic_plus.png" style="height: 18px; width: 18px;"/></div>
							<div class="avatar-row-follow-text">关注</div>
						</div>
						<div class="avatar-row-follow">
							<div><img src="../../images/ic_message.png" style="height: 20px; width: 20px;"/></div>
							<div class="avatar-row-follow-text">私信</div>

						</div>
					</div>
				</div>
			</div>
			<div class="row-post-followers-following">
				<div class="row-post-followers-following-cell">
					<div class="row-post-followers-following-cell-count">{{user.topicCount}}</div>
					<div class="row-post-followers-following-cell-title">帖子</div>
				</div>
				<div class="row-post-followers-following-cell-divider"></div>
				<div class="row-post-followers-following-cell">
					<div class="row-post-followers-following-cell-count">{{user.followersCount}}</div>
					<div class="row-post-followers-following-cell-title">粉丝</div>
				</div>
				<div class="row-post-followers-following-cell-divider"></div>
				<div class="row-post-followers-following-cell">
					<div class="row-post-followers-following-cell-count">{{user.followingCount}}</div>
					<div class="row-post-followers-following-cell-title">关注</div>
				</div>
			</div>

			<!-- bio -->
			<div class="property-title">简介</div>
			<div class="bio-content">{{user.intro}}</div>

			<!-- 商家信息 -->
			<div class="property-title">商家信息</div>
			<div class="detail-row" v-if="user.businessHours != null && user.businessHours.length > 0">
				<img src="../../images/bx-calendar-heart.png"/>
				<div class="open-status open-status-open" v-if="this.isOpenNow">Open now</div>
				<div class="open-status open-status-closed" v-else >Closed now</div>
				<div class="detail-row-content" style="text-align: end;">{{openTimeToday}}</div>
				<img src="../../images/bx-chevron-down.png"/>
			</div>

			<div class="detail-row" v-if="user.telephone != null && user.telephone.length > 0">
				<img src="../../images/bx-phone.png"/>
				<div class="detail-row-content">{{user.telephone}}</div>
				<div class="detail-row-action">Call</div>
			</div>

			<div class="detail-row" v-if="user.website != null && user.website.length > 0">
				<img src="../../images/bx-web-monitor-window-alt.png"/>
				<div class="detail-row-content">{{user.website}}</div>
				<div class="detail-row-action">Visit</div>
			</div>

			<div class="detail-row" v-if="user.location != null && user.location.length > 0">
				<img src="../../images/bx-map.png"/>
				<div class="detail-row-content">{{user.location}}</div>
				<div class="detail-row-action">Map</div>
			</div>
			<div class="map">
				<img src="../../images/map.png" style="height: 140;width: 100%;"/>
			</div>

			<!-- tags -->
			<div class="property-title">Tags</div>
			<div class="tags-row">
				<div class="tag gold" v-for="(issue,index) in this.user.issueList" :key="index">{{issue.name}}</div>
				<div class="tag gray" v-for="(issue,index) in this.user.businessList" :key="index">{{issue.name}}</div>
			</div>
			<div style="height: 80px;"></div>
		</div>
		<div id="mask">
			<wx-open-launch-app class="view-in-app" v-on:launch="launchApp" v-on:error="launchError"
				appid="wx4e61c8e6b7007cc8" :extinfo="launchAppUrl">
				<script type="text/wxtag-template">
					<style>
						.view-in-app {
							border-radius: 100px;
							padding: 8px 16px;
							background-color: #6599FF;
							color: white;
							border: none;
							font-size: 14px;
							width: 180px;
							display: flex;
							justify-content: space-between;
							align-items: center;
						}
						.logo-app-open {
							width: 70px;
						}
					</style>
			<button class="view-in-app"><img class="logo-app-open" src="https://h5.thewavingapp.com/img/logo.png" /><span>App内打开</span></button>
			</script>
			</wx-open-launch-app>
		</div>
		<ToDialog :show="dialogVisible" @submit="gotoDownload" />
	</div>
</template>

<script>
	import axios from "axios";
	import moment from "moment";
	import ToDialog from "../../components/ToDialog.vue";
	import "element-ui/lib/theme-chalk/index.css";
	import HtmlFilter from 'html-filter';
	// import Avatar from "../../components/Avatar";

	export default {
		name: "Business",
		components: {
			ToDialog,
			// Avatar,
		},

		data: () => ({
			user:{
				uid: -1,
				name: "加载中...",
				nickname: "加载中...",
				title: "",
				avatar: "",
				intro: "",
				role: 1,
				relationship: 0,
				followersCount: 0,
				followingCount: 0,
				topicCount: 0,
				businessHours: [],
				telephone: "",
				latitude: "",
				longitude: "",
				location: "",
				website: "",
				businessList: [],
				issueList: [],
			},
			dialogVisible: false,
			isOpenNow: false,
			openTimeToday: "",
		}),

		computed: {
			launchAppUrl() {
				const {
					id
				} = this.$router.currentRoute.params;
				return `/user/${id}`;
			},
		},

		methods: {
			launchApp() {

      },
			launchError() {
				// alert(err.detail.errMsg);
				this.oia();
			},
			gotoDownload(e) {
				if (e) {
					this.$emit("onClickCall");
					this.download();
				}
				this.dialogVisible = false;
			},

			download() {
				var ua = navigator.userAgent;
				var url = `https://play.google.com/store/apps/details?id=com.dazhixinany.know`;
				var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
				if (isIOS) {
					url = `https://apps.apple.com/nz/app/%E7%AD%94%E7%9F%A5%E6%96%B0/id1551768968`;
				}
				var isAndroid = ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1;
				if (isAndroid) {
					var isHuawei = ua.toLowerCase().match(/huawei/i) == "huawei";
					if (isHuawei) {
						url = `https://appgallery.cloud.huawei.com/ag/n/app/C104495637?locale=zh_CN&source=appshare&subsource=C104495637&shareTo=com.android.bluetooth&shareFrom=appmarket`;
					}
				}
				window.location.href = url;
			},

			getIsOpenNow() {
				var now = new Date();
				var businessTimes = this.user.businessHours;
				//后台businessHours数组从周一开始
				var dayIndex = (now.getDay() + 7 - 1) % 7;
				if(businessTimes.length - 1 < dayIndex)return false;
				var businessTime = businessTimes[dayIndex];
				if(businessTime.toLowerCase() == "closed")return false;
				var businessTimeSplit = businessTime.trim().split(',');
				// console.log(businessTimeSplit);
				this.openTimeToday = businessTime;
				for(var i = 0; i < businessTimeSplit.length; i++){
					var timeStr = businessTimeSplit[i];
					var times = timeStr.trim().split("-");
					if (times.length < 2) return false;
					var startTimeStr = times[0];
					var endTimeStr = times[1];
					var startAtPM = startTimeStr.toLowerCase().indexOf("pm") > 0;
					var endAtPM = endTimeStr.toLowerCase().indexOf("pm") > 0;
					startTimeStr = startTimeStr.toLowerCase().replaceAll("am", "").replaceAll("pm", "");
					endTimeStr = endTimeStr.toLowerCase().replaceAll("am", "").replaceAll("pm", "");
					var startHour = parseInt(startTimeStr.trim().split(":")[0]);
					var startMin = parseInt(startTimeStr.trim().split(":")[1]);
					var endHour = parseInt(endTimeStr.trim().split(":")[0]);
					var endMin = parseInt(endTimeStr.trim().split(":")[1]);
					if (startAtPM && startHour < 12) startHour = startHour + 12;
					if (endAtPM && endHour < 12) endHour = endHour + 12;
					var startTimeToday = new Date(now.getYear(), now.getMonth(), now.getDate() -1, startHour, startMin);
					var endTimeToday = new Date(now.getYear(), now.getMonth(), now.getDate() -2, endHour, endMin);
					// console.log(startTimeToday);
					// console.log(endTimeToday);
					if(now.getTime() > startTimeToday.getTime() && now.getTime() < endTimeToday.getTime())return true;
				}

				return false;
			},
		},

		created() {
			axios.defaults.baseURL = "https://api.knewzie.com";
			const { wx } = window;
			const timestamp = moment().unix();
			const appId = "wxd6fe3b0d4e0030ac";
			const nonceStr = "knewzie";
			const { id } = this.$router.currentRoute.params;
			axios.post(`/user/info`, { queryUserId:id }).then((response) => {
				this.user = response.data.data;
				console.log(this.user);
				this.isOpenNow = this.getIsOpenNow();
				}).then(() =>axios.post(`/config/mp/signature`, {
					appId,
					noncestr: nonceStr,
					timestamp: timestamp,
					url: window.location.href,
					})
					).then((response) => {
						const { data: sign } = response.data;
						const htmlFilter = new HtmlFilter();
						var filterContent = htmlFilter.filter(this.user.intro);
						wx.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
							appId: appId, // 必填，公众号的唯一标识
							timestamp: timestamp, // 必填，生成签名的时间戳
							nonceStr: nonceStr, // 必填，生成签名的随机串
							signature: sign, // 必填，签名
							jsApiList: [
								"updateAppMessageShareData",
								"updateTimelineShareData",
								"onMenuShareAppMessage",
								"onMenuShareTimeline",
								"onMenuShareQQ",
								"onMenuShareQZone",
								], // 必填，需要使用的JS接口列表
							openTagList: ["wx-open-launch-app"],
						});
						wx.error(function (res) {
							alert(JSON.stringify(res));
							});

						wx.ready(() => {
							let imgUrlThis = "https://h5.knewzie.com/img/icon.jpeg";
							if (this.article.imageList && this.article.imageList.length > 0) {
								imgUrlThis = this.article.imageList[0];
								}

							//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
							wx.updateTimelineShareData({
								title: this.article.title,
								desc: filterContent, // 分享描述
								link: window.location.href,
								imgUrl: imgUrlThis,
								success: function () {},
								});
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
							wx.updateAppMessageShareData({
								title: this.article.title, // 分享标题
								desc: filterContent, // 分享描述
								link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
								imgUrl: imgUrlThis, // 分享图标
								success: () => {}
								});
							});
			});
		},
	}
</script>

<style>

	.open-status{
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
	}
	.open-status-open{
		color: #0764DF;
	}
	.open-status-closed{
		color: #F08A40;
	}
	.tags-row{
		margin-top: 8px;
		min-height: 30px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.tags-row .tag{
		padding: 4px 8px;
		font-weight: 500;
		font-size: 11px;
	}
	.tags-row .gold{
		background-color: rgba(255, 161, 18, 0.1);
		color: #FDA929;
		border: 1px solid #FDA929;
		border-radius: 100px;
	}

	.tags-row .gray{
		background-color: #ffffff;
		color: #6A7292;
		border: 1px solid #6A7292;
		border-radius: 100px;
	}
	.detail-row{
		margin: 12px 0px;
		display: flex;
		justify-content: space-between;
		align-items:flex-start;
		gap: 8px;
	}
	.detail-row-content{
		flex: 1;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #6A7292;
	}
	.detail-row-action{
		font-weight: 400;
		font-size: 13px;
		line-height: 16px;
		text-decoration-line: underline;
		color: #0764DF;
	}
	.detail-row img{
		width: 18px;
		height: 18px;
	}
	.bio-content{
		min-height: 30px;
		margin-top: 8px;
		font-weight: 500;
		font-size: 11px;
		line-height: 16px;
		color: #6A7292;
	}
	.property-title{
		margin-top: 16px;
		font-weight: 600;
		font-size: 16px;
		line-height: 22px;
		color: #051A37;
	}

	.row-post-followers-following{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 58px;
		margin-top: 16px;
	}
	.row-post-followers-following-cell{
		flex:1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 58px;
		gap: 6;
	}
	.row-post-followers-following-cell-count{
		font-weight: 600;
		font-size: 16px;
		line-height: 22px;
		color: #051A37;
	}
	.row-post-followers-following-cell-title{
		font-weight: 500;
		font-size: 11px;
		line-height: 16px;
		color: #6A7292;
	}
	.row-post-followers-following-cell-divider{
		height: 18px;
		width: 1px;
		background: #EBECEE;
;
	}

	.profile{
		padding-top: 80px;
		padding-left: 20px;
		padding-right: 20px;
	}
	.avatar-row{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.sCimg{
		width: 40px;
		height: 40px;
	}
	.avatar-row-follow{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 4px;

		width: 110px;
		margin-right: 10px;
		height: 36px;
		background: #0764DF;
		border-radius: 100px;
		flex: none;
		order: 0;
		flex-grow: 1;
	}
	.avatar-row-follow-text{
		margin-left: 6px;
		font-weight: 400;
		font-size: 13px;
		color: #FFFFFF;
	}

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
