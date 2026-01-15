
(async function () {
    
  if (window.__SUPPORT_WIDGET_LOADED__) return;
  window.__SUPPORT_WIDGET_LOADED__ = true;

  const script = document.currentScript;
  const siteId = script.getAttribute("data-site-id");
  const userId = script.getAttribute("data-user-id");
  const userName = script.getAttribute("data-user-name");
  const email = script.getAttribute("data-user-email");
  const checkIn = script.getAttribute("data-checkin-time");
  const checkOut = script.getAttribute("data-checkout-time");
 
   
  if (!siteId) {
    alert("Embedded widget: data-site-id field missing");
    return ;
  }
  else if (!userId) {
    alert("Embedded widget: data-user-id field missing");
    return;
  }
  else if (!userName) {
    alert("Embedded widget: data-user-name field missing");
    return;
  }
  else if (!email) {
    alert("Embedded widget: data-user-email field missing");
    return;
  }
  else if (!email) {
    alert("Embedded widget: data-user-email field missing");
    return;
  }
  else if (!checkIn) {
    alert("Embedded widget: data-checkin-time field missing");
    return;
  }
  else if (!checkOut) {
    alert("Embedded widget: data-checkout-time field missing");
    return;
  }
  
  
  const iframe = document.createElement("iframe");
  let dataObj = {}
  iframe.src = "https://makvueconcierge.com/widget-ui?siteId=" + siteId +"&userId=" +userId  +'&userName='+userName +'&email='+email +'&checkInTime='+checkIn+'&checkOutTime='+checkOut ;
  try {    
    await fetch(`https://makvueconcierge.com/api/widget/widget-settings?siteId=${siteId}`).then((res)=>res.json()).then((data)=>dataObj =data) 
  } catch (error) {
    alert('Error fetching widget settings')
  }

  
  if (dataObj.widgetPosition ==='top-left') {
    iframe.style.left = "0px"
    iframe.style.top = "0px"
  } else if(dataObj.widgetPosition ==='top-right') {
    iframe.style.top = "0px";
    iframe.style.right = "0px";
  
  } else if(dataObj.widgetPosition ==='bottom-right') {
    iframe.style.bottom = "0px";
    iframe.style.right = "0px";
  }
   else if(dataObj.widgetPosition ==='bottom-left') {
    iframe.style.bottom = "0px";
    iframe.style.left = "0px";
  }
  
  iframe.style.position = "absolute";
  iframe.style.width = "75%";
  iframe.style.height = "90%";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.backgroundColor ="black"
  iframe.style.overflowY = "hidden"
  document.body.appendChild(iframe);
})();

