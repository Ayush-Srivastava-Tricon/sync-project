import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { AppConstants } from 'src/app/constants/app.constant';
import { AlertService } from 'src/app/shared/alert.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  currentDate: Date = new Date();
  currentMonth: any = '';
  currentYear: number = 0;
  weekdaysWithDates: any = [];
  randomTexts: string[] = ['Units to Sell', 'Lenght of Stay', 'Restriction', 'Price'];
  datesData: any = [];
  showModal: boolean = false;
  mainData: any = [];
  hotelPrice: any = [];
  hotelRooms: any = [];
  todayDate: any = new Date();
  // showModalConfig: any = {
  //   "all_data": {
  //     "pr": "",
  //     "ss": "",
  //     "mn": "",
  //     "mx": "",
  //     "cta": "",
  //     "ctd": "",
  //     "cu": "",
  //     "al": "",
  //   }
  // };  
  showAdvanceSection: boolean = false;
  selectDate: any = '';
  errorMsg: any = '';
  nextDisplayMonth: any;
  modalFieldForm: any;
  loader: boolean = false;
  dragEl: any = {};
  activeModalRoomName: string = '';
  dragEventStart: boolean = false;
  selectedStartDate: any;
  selectedEndDate: any;
  timeoutId: any = null;
  allPropertyList: any = [];
  loggedProperty: any = { 'isLoginProperty': false, 'propertyId': 0 };
  isAdmin: boolean = false;
  isOwner: boolean = false;
  isDeriveModalActive: boolean = false;
  timeZoneAndStartDate: any = {};
  currentOtaDetails: any;

  constructor(private fb: FormBuilder, private alert: AlertService, public constant: AppConstants, private _service: AdminService,private router:Router) {
    this.modalFieldForm = this.fb.group({
      "pr": ['', [Validators.pattern(/^\d*\.?\d*$/)]],
      "ss": ['',],
      "mn": ['', [Validators.maxLength(2), Validators.pattern("^[0-9]*$")]],
      "mx": ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
      "cta": ['',],
      "ctd": ['',],
      "cu": ['', [Validators.pattern("^[0-9]*$")]],
      "al": ['', [Validators.pattern("^[0-9]*$")]],
      "start": ['',],
      "end": ['',],
      "resource": [''],
      "parent_room_id": [''],
    });
  }

  ngOnInit(): void {


    let myloacalData: any = localStorage.getItem('current_ota_detail');
    this.currentOtaDetails = JSON.parse(myloacalData);
    this.fetchData();
  }

  fetchData() {
    let params: any = {

      start_date: this.currentOtaDetails.from,
      room_id: this.currentOtaDetails.room_id,
      ota_id: this.currentOtaDetails.ota_id,
      property_id: this.currentOtaDetails.property_id,
      end_date: ''
    }
    this._service.fetchCalendarDataByStartEndDate(params, (res: any) => {
      if (res.status == 200) {
        this.selectedDate({ target: { value: this.formatDate(this.todayDate) } });
        this.mainData = res.data;
      }
    })
  }


  setDataToAllPropertyDropdown() {
    this.allPropertyList = JSON.parse(<any>localStorage.getItem("propertyList"));
  }

  // fetchCalendarData(nextButtonDate?: any, isFromDateRange?: boolean) {
  //   this.mainData = [];
  //   let startEndDate: any = this.getStartAndEndDate(nextButtonDate, isFromDateRange);
  //   this.loader = true;
  //   this._service.getAllCalendarData(this.loggedProperty.propertyId, startEndDate, (res: any) => {
  //     if (res.status == 200 && res.responseData.length > 0) {
  //       this.mainData = res.responseData;
  //       this.alertService.alert(res.responseData.length > 0 ? "success" : 'error', res.message, "Success", { displayDuration: 2000, pos: 'top' });
  //       setTimeout(() => {
  //         this.renderCalendar(this.selectDate);
  //       }, 0);
  //     } else if (res.status == 404) {
  //       // this.alertService.alert("error", res.error.message, "error", { displayDuration: 2000, pos: 'top' });
  //       setTimeout(() => {
  //         this.renderCalendar(this.selectDate);
  //       }, 0);
  //     } else {
  //       this.mainData = [];
  //       this.loader = false;
  //     }
  //   })
  // }

  getStartAndEndDate(nextButtonDate: any, isFromDateRange?: boolean) {
    let now: any;
    if (isFromDateRange) {
      now = new Date(nextButtonDate);
    }
    else if (nextButtonDate) {
      now = new Date(nextButtonDate).setDate(1);
      now = new Date(now);
    } else {
      now = new Date();
    }
    let current: any;
    if (now.getMonth() == 11) {
      current = new Date(now.getFullYear() + 1, 0, now.getDate());
    }
    else {
      current = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    return `start_date=${this.formatDate(now)}&end_date=`;
  }

  selectedDate(event: any) {
    this.selectDate = new Date(event.target.value);
    this.datesData = [];
    this.renderCalendar(this.selectDate);
    // this.fetchCalendarData(this.selectDate, true);
  }


  renderCalendar(selectedDate?: Date): void {
    const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.currentDate = selectedDate ? new Date(selectedDate) : this.currentDate;
    const currentMonth: number = this.currentDate.getMonth();
    const currentYear: number = this.currentDate.getFullYear();
    const todayDate: number = new Date().getDate();
    const todayMonth: number = new Date().getMonth();
    const todayYear: number = new Date().getFullYear();

    const daysInMonth: number = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDayOfMonth: number = new Date(currentYear, currentMonth, 1).getDay();

    this.currentMonth = `${monthNames[currentMonth]} ${currentYear}`;
    this.weekdaysWithDates = [];
    this.datesData = [];

    let dateIndex = 0;
    let dayCounter = selectedDate ? selectedDate.getDate() - 1 : 0;
    let currentDayIndex = (firstDayOfMonth + dayCounter) % 7;
    this.nextDisplayMonth = monthNames[new Date(this.currentDate).getMonth() + 1 == 12 ? 0 : new Date(this.currentDate).getMonth() + 1];

    for (let i = selectedDate ? selectedDate.getDate() : 1; i <= daysInMonth && dateIndex < 31; i++) {
      const dayName = weekDays[currentDayIndex % 7];
      const date = i;
      const isPassed = this.isDatePassed(this.formatDate(`${date} ${monthNames[currentMonth]} ${currentYear}`));

      this.weekdaysWithDates.push({
        weekday: dayName,
        date: date,
        isPassed: isPassed,
        formateDate: this.formatDate(`${date} ${monthNames[currentMonth]} ${currentYear}`),
        isSelectedDate: selectedDate && selectedDate.getDate() === date
      });
      this.datesData.push({ date: date, formateDate: this.formatDate(`${date} ${monthNames[currentMonth]} ${currentYear}`), isDatePassed: isPassed });
      dateIndex++;
      currentDayIndex++;
    }

    let monthCounter = 1;
    while (dateIndex < 31) {
      const nextMonth = (currentMonth + monthCounter) % 12;
      const nextYear = currentMonth + monthCounter > 11 ? currentYear + 1 : currentYear;
      const nextMonthDays = new Date(nextYear, nextMonth + 1, 0).getDate();

      for (let i = 1; i <= nextMonthDays && dateIndex < 31; i++) {
        const dayName = weekDays[currentDayIndex % 7];
        const isPassed = (nextYear === todayYear && nextMonth === todayMonth) ?
          (i < todayDate) :
          (nextYear < todayYear || (nextYear === todayYear && nextMonth < todayMonth));

        this.weekdaysWithDates.push({
          weekday: dayName,
          date: i,
          isPassed: isPassed,
          formateDate: this.formatDate(`${i} ${monthNames[nextMonth]} ${nextYear}`)
        });
        this.datesData.push({ date: i, formateDate: this.formatDate(`${i} ${monthNames[nextMonth]} ${nextYear}`), isDatePassed: isPassed });
        dateIndex++;
        currentDayIndex++;
      }
      monthCounter++;
    }
    setTimeout(() => {
      this.makeCalendarData();
    }, 0);
  }

  isDatePassed(date: any) {
    const inputDate = new Date(date);
    const currentDate = this.todayDate;
    const inputYear = inputDate.getFullYear();
    const inputMonth = inputDate.getMonth();
    const inputDay = inputDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    if (inputYear < currentYear) {
      return true;
    } else if (inputYear === currentYear && inputMonth < currentMonth) {
      return true;
    } else if (inputYear === currentYear && inputMonth === currentMonth && inputDay < currentDay) {
      return true;
    }

    return false;
  }

  extractEventData(allData: string): any {
    const eventData: any = {};
    const keyValuePairs = allData.split("<br>");
    keyValuePairs.forEach(pair => {
      const [key, value] = pair.split(":");
      eventData[key.replace(/"/g, "").trim()] = value.replace(/"/g, "").trim();
    });

    return eventData;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate);
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.datesData = [];
    if ((this.currentDate.getMonth() + 1) != (new Date().getMonth() + 1)) {
      this.selectDate = '';
      let selectedRangeDate: any = document.getElementById("date");
      let setFirstMonthDate: any = new Date(this.currentDate).setDate(1)
      selectedRangeDate.value = this.formatDate(new Date(setFirstMonthDate));
      // this.fetchCalendarData(this.formatDate(this.currentDate), false);
    } else {
      this.selectDate = new Date();
      let selectedRangeDate: any = document.getElementById("date");
      selectedRangeDate.value = this.formatDate(this.selectDate);
      // this.fetchCalendarData(this.formatDate(this.selectDate), true);
    }
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate);
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.datesData = [];
    if ((this.currentDate.getMonth() + 1) != (new Date().getMonth() + 1)) {
      this.selectDate = '';
      let selectedRangeDate: any = document.getElementById("date");
      let setFirstMonthDate: any = new Date(this.currentDate).setDate(1)
      selectedRangeDate.value = this.formatDate(new Date(setFirstMonthDate));
      // this.fetchCalendarData(this.formatDate(this.currentDate), false);
    } else {
      this.selectDate = new Date();
      let selectedRangeDate: any = document.getElementById("date");
      selectedRangeDate.value = this.formatDate(this.selectDate);
      // this.fetchCalendarData(this.formatDate(this.selectDate), true);
    }
  }


  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  makeCalendarData() {
    // this.mainData=[
    //   {
    //     room_id:1,
    //     room_name:"Wonder Full",
    //     data:[
    //       {
    //         date:"2024-07-30",
    //         "accom_id": 38651,
    //         "available": 4,
    //         "rate": "238.5",
    //         "breakdown": [
    //             "238.5"
    //         ],
    //         "minlos": 1,
    //         "maxlos": 5
    //       }
    //     ] 
    //   }
    // ]
    this.mainData.forEach((e: any) => {
      e.data.forEach((item: any) => {
        for (let i = 0; i < this.datesData.length; i++) {
          if (new Date(item.start_date).setHours(0, 0, 0, 0) == new Date(this.datesData[i].formateDate).setHours(0, 0, 0, 0)) {
            this.datesData[i]['newData'] = item;
            this.datesData[i].newData['resource'] = e.room_id;
            this.datesData[i].newData['start'] = item.date;
            break;
          }
        }
      })
      e['datesData'] = JSON.parse(JSON.stringify(this.datesData));
    });
    this.loader = false;

    console.log(this.mainData);


  }

  closeModal() {
    this.showModal = false;
    this.showAdvanceSection = false;
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.dragEl = {};
  }

  resetDefault() {
    this.dragEl = {};
    this.showModal = false;
    this.selectDate = '';
    this.datesData = [];
  }

  selectCalendarDateRange(startingDate: any, dIdx: number, calIdx: number, calendarIdx: any = '', isDerive: any = '') {

    // this.dragEl[`head${dIdx}${calIdx}${calendarIdx}${isDerive}`] = !this.dragEl[`head${dIdx}${calIdx}${calendarIdx}${isDerive}`];

  }

  handleClickEvent(startDate: any, dayData: any, roomName: any, roomId: any, isDeriveModalActive: boolean) {
    if (this.timeoutId !== null) {            //this part will run if double clicked within 200ms
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      this.openModal(dayData, roomName, startDate, roomId);
    } else {                                      //this part will run if single clicked 
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;

        if (!this.selectedStartDate) {
          this.selectedStartDate = startDate;
        }
        this.dragEventStart = !this.dragEventStart;
        if (!this.dragEventStart) {
          if (new Date(this.selectedStartDate).setHours(0, 0, 0, 0) >= new Date(startDate).setHours(0, 0, 0, 0)) {
            let tempDate: any = this.selectedStartDate;
            this.selectedStartDate = startDate;
            startDate = tempDate;
            this.openModal({}, roomName, startDate, roomId);
          }
          this.openModal({}, roomName, startDate, roomId);
        }

      }, 200);
    }
    this.isDeriveModalActive = isDeriveModalActive;

    if (this.isDeriveModalActive) {
      this.toggleModalFieldDisableEnable(dayData);
    } else {
      this.setModalFieldEnable();
    }
  }

  openModal(data: any, roomName: any, endDate?: any, roomId?: any) {
    this.dragEventStart ? '' : this.selectedEndDate = endDate;
    this.dragEl = {};
    this.dragEventStart = false;
    let eventData: any = data || {};

    if (eventData) {
      this.modalFieldForm.patchValue({
        "pr": eventData?.pr,
        "ss": eventData?.ss,
        "mn": eventData?.mn,
        "mx": eventData?.mx,
        "cta": eventData?.cta,
        "ctd": eventData?.ctd,
        "cu": eventData?.cu,
        "al": eventData?.al,
        "start": this.selectedStartDate ? this.selectedStartDate : eventData.start,
        "end": this.selectedEndDate ? this.selectedEndDate : eventData.end,
        "resource": roomId,
        'parent_room_id': eventData.parent_room_id
      });
      this.activeModalRoomName = roomName;
    } else {
      this.modalFieldForm.reset();
    }
    this.showModal = true;
  }

  updateValue() {
    if (this.modalFieldForm.status == 'VALID') {
      const selectedRoomId: any = this.modalFieldForm.value.resource;
      delete this.modalFieldForm.value.resource;
      const parent_room_id: any = this.modalFieldForm.value.parent_room_id;
      delete this.modalFieldForm.value.parent_room_id;
      const params: any = {
        'room_id': selectedRoomId,
        'parent_room_id': parent_room_id,
        "property_id": +this.loggedProperty.propertyId,
        "data": [this.modalFieldForm.value]
      }
      this.loader = true;
      // this._service.updateCalendar(params, (res: any) => {
      //   if (res) {
      //     this.loader = false;
      //     this.resetDefault();
      //     this.currentDate = new Date();
      //     this.selectedDate({ target: { value: this.formatDate(this.todayDate) } })
      //     this.alertService.alert("success", "Data Saved Successfully", "Success", { displayDuration: 2000, pos: 'top' });
      //     this.modalFieldForm.reset();
      //   }
      // })
    } else {
      this.loader = false;
      this.errorMsg = "Please Fill the fields";
      this.alert.alert("error", "Please Check Fields Again", "Error", { displayDuration: 2000, pos: 'top' });
    }
  }

  changeCalendarByProperty(event: any) {
    localStorage.setItem("selectedPropertyId", JSON.parse(event.target.value));
    this.loggedProperty.propertyId = event.target.value;
    this.datesData = [];
    // this.fetchCalendarData(this.formatDate(this.selectDate), true);
  }

  identify(index: any, item: any) {
    return item.id;
  }

  addClass(event: any) {

  }

  toggleModalFieldDisableEnable(item: any) {
    if (item.map_change_avail == '1') {
      this.modalFieldForm.controls.al.disable();
    }
    if (item.map_change_restriction == '1') {
      this.modalFieldForm.controls.cta.disable();
      this.modalFieldForm.controls.ctd.disable();
      this.modalFieldForm.controls.cu.disable();
    }
    if (item.map_change_stopsale == '1') {
      this.modalFieldForm.controls.ss.disable();
    }
    if (item.map_change_stay == '1') {
      this.modalFieldForm.controls.mx.disable();
      this.modalFieldForm.controls.mn.disable();
    }
    if (item.derivedPriceType.toLowerCase() == 'not derived') {
      this.modalFieldForm.controls.pr.disable();
    }
  }

  setModalFieldEnable() {
    this.modalFieldForm.controls.cta.enable();
    this.modalFieldForm.controls.ctd.enable();
    this.modalFieldForm.controls.cu.enable();
    this.modalFieldForm.controls.al.enable();
    this.modalFieldForm.controls.mx.enable();
    this.modalFieldForm.controls.mn.enable();
    this.modalFieldForm.controls.pr.enable();
  }

  formatDateWithTimezone(startingDay: any, timeZone: any) {
    // Parse timeZone string to extract hours and minutes
    const [sign, hours, minutes] = timeZone.match(/([-+])(\d{1,2}):(\d{2})/).slice(1);
    const offsetMilliseconds = (parseInt(hours, 10) * 60 + parseInt(minutes, 10)) * 60000;
    const timeZoneOffset = (sign === '-' ? -1 : 1) * offsetMilliseconds;

    const currentDate = new Date();
    currentDate.setUTCDate(startingDay);
    const adjustedDate = new Date(currentDate.getTime() + timeZoneOffset);

    const yyyy = adjustedDate.getUTCFullYear();
    const mm = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(adjustedDate.getUTCDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  importPriceAndAvailability(action: any) {

    this.loader = true;



    const { url, auth, action_url } = this.constant.ota_api_url[this.currentOtaDetails.site_name];
    let fullUrl = `${url}/${action_url[action]['url']}`;
    let queryParamsForApi: any = action_url[action]['params'];

    if (queryParamsForApi) {
      Object.keys(queryParamsForApi).forEach(key => {
        if (queryParamsForApi[key]) {
          fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${key}=${this.currentOtaDetails[key]}`;
        }
      });
    }

    this._service.importCalendarData({ site_details: this.currentOtaDetails, apiUrl: fullUrl, authType: auth }, (res: any) => {
      if (res.status == 200) {
        this.fetchData();
        this.loader = false;
        this.alert.alert("success", res.message, "Success", { displayDuration: 2000, top });
      } else {
        this.alert.alert("trash", res.message, "Error", { displayDuration: 2000, top });
      }
    })


  }

  backToViewRoom(){
    this.router.navigate(['view_room',this.currentOtaDetails.room_id])
  }


}