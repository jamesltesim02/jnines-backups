var countdown=0;function setexpire(){countdown=Date.now(),setTimeout(function(){countdown=0},9e3)}function getexpire(){if(!countdown)return!1;var n=10-parseInt((Date.now()-countdown)/1e3),t=n>0&&n<10?n:0;return!(n<=0)&&(t?($.toast.fail("请等"+t+"秒再试",1e3),!0):countdown>0&&($.toast.fail("请等10秒再试",1e3),!0))}