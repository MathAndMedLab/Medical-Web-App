import React, {useEffect, useState} from 'react'

const TimeMsg = (props) => {
	const { timeZone } = props
	const { sendDate } = props
	const [timeMsgCurrentTimeZone, setTimeMsgCurrentTimeZone] = useState([])
	useEffect(async () => {
		processTime()
	}, [timeZone, sendDate]);
	function processTime() {
		let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
		const difsTimeZones = getOffsetBetweenTimezonesForDate(new Date(), timeZone, timeZone)
		setTimeMsgCurrentTimeZone(new Date(new Date(sendDate).getTime() - difsTimeZones))
	}

	function getOffsetBetweenTimezonesForDate(date, timezone1, timezone2) {
		const timezone1Date = convertDateToAnotherTimeZone(date, timezone1);
		const timezone2Date = convertDateToAnotherTimeZone(date, timezone2);
		return timezone1Date.getTime() - timezone2Date.getTime();
	}

	function convertDateToAnotherTimeZone(date, timezone) {
		const dateString = date.toLocaleString('en-US', {
			timeZone: timezone
		});
		return new Date(dateString);
	}

	return (
		<div>
			{
				(((new Date(timeMsgCurrentTimeZone).getHours() < 10 && "0" + new Date(timeMsgCurrentTimeZone).getHours())
						|| (new Date(timeMsgCurrentTimeZone).getHours() >= 10 && new Date(timeMsgCurrentTimeZone).getHours())) + ":"
					+ ((new Date(timeMsgCurrentTimeZone).getMinutes() < 10 && "0" + new Date(timeMsgCurrentTimeZone).getMinutes())
						|| (new Date(timeMsgCurrentTimeZone).getMinutes() >= 10 && new Date(timeMsgCurrentTimeZone).getMinutes())
					)) + "    " + (
					((new Date(timeMsgCurrentTimeZone).getDate() < 10 && "0" + new Date(timeMsgCurrentTimeZone).getDate()) || (new Date(timeMsgCurrentTimeZone).getDate() >= 10 && new Date(timeMsgCurrentTimeZone).getDate()))
					+ "."
					+ (((new Date(timeMsgCurrentTimeZone).getMonth() + 1) < 10 && "0" + (new Date(timeMsgCurrentTimeZone).getMonth() + 1)) || (((new Date(timeMsgCurrentTimeZone).getMonth() + 1) >= 10 && (new Date(timeMsgCurrentTimeZone).getMonth() + 1))))
					+ "." + new Date(timeMsgCurrentTimeZone).getFullYear()
				)
			}
		</div>
	)
}

export default TimeMsg