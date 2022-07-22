# ZohoCRM-DateTime-Field-Comparison-Deluge
A quick script for comparing Zoho CRM date time fields with a use case.

## Problem Statement
Zoho CRM Date Time fields are stored in this format - "2022-07-20T17:21:37-05:00", which is annoyingly not a valid date time format in Deluge. In order to perform date time comparisons or apply any date time functions in Deluge, we need to format it into "20-Jul-2022 17:21:37" and apply a `.toDateTime()` function.

This article is meant to save some time in converting date time fields.

## Tutorial

### Original Dataset
- Here's are two date examples in the Zoho CRM date time field format

```javascript
// Ori Dataset
date1 = "2022-07-20T17:21:37-05:00";
date2 = "2022-07-20T17:23:13-05:00";
info "Unformatted Dates";
info date1;
info date2;
info "------------------";
```

### Format the Dates
- Apply some text manipulation to format the date time field to the required format in Deluge
- If you're using purely for date time comparison (to find out which is more recent / earlier) like in this exercise, we can ignore the GMT suffix

```javascript
// Format the Dates
date1_f = date1.left(date1.indexOf("T")).toDate() + " " + date1.subString(date1.indexOf("T")+1,date1.lastIndexOf("-"));
date2_f = date2.left(date2.indexOf("T")).toDate() + " " + date2.subString(date1.indexOf("T")+1,date2.lastIndexOf("-"));

info "Formatted Dates";
info date1_f;
info date2_f;
info "------------------";
```

### Compare
- Now that you've converted the date time fields to the required string format, use the `.toDateTime()` function to convert the string to an actual date time field and make the comparison.

```javascript
// Compare
info "Compare";
info "date1_f > date2_f";
info date1_f.toDateTime() > date2_f.toDateTime();
info "date2_f > date1_f";
info date2_f.toDateTime() > date1_f.toDateTime();
```

## Use Case
Here's an example use case: We need to get the Opp (Deals module) that has the the most recent text (via Smooth Messages extension) related to a Customer (Contacts module).
Here's how we'll do it:
- Get all Opps related to the Customer
- Use date time comparison to get the latest text date of every Opp in the Smooth Messages related list and the respective Opp (if it exists)
- Then use date time comparison again to compare the latest text date among all Opps

*Note: If you're not familiar with Smooth Messages, all texts are stored in the Smooth Messages related list in the modules.*

### Example Script

```javascript
opps = zoho.crm.getRelatedRecords("Deals", "Contacts", contactId);
oppLatestDateMap = Map();
if (opps.size() > 0)
{
	for each o in opps
	{
		// Init latestDate
		latestDate = "01-Jan-1900 00:00:00";
		// Get related Smooth Messages records
		oppMessages = zoho.crm.getRelatedRecords("Twilio_Messages", "Deals", o.get("id"));
		if (oppMessages.size() > 0)
		{
			for each om in oppMessages
			{
				// Format createdTime
				createdTime = om.get("Created_Time");
				createdTime_f = createdTime.left(createdTime.indexOf("T")).toDate() + " " + createdTime.subString(createdTime.indexOf("T")+1,createdTime.lastIndexOf("-"));
				// Make comparison
				if (latestDate.toDateTime() < createdTime_f.toDateTime())
				{
					latestDate = createdTime_f;
					latestOppId = o.get("id");
				}
			}
			oppLatestDateMap.put(latestOppId,latestDate);
		}

	}
}
info oppLatestDateMap;
if (!oppLatestDateMap.isEmpty())
{
	// Init latestDate
	latestDate = "01-Jan-1900 00:00:00";
	for each oldm in oppLatestDateMap.keys()
	{
		// Make comparison
		if (latestDate.toDateTime() < oppLatestDateMap.get(oldm).toDateTime())
		{
			latestOppId = oldm;
		}
	}
	info latestOppId;
}
else
{
	info "There are no messages for this customer.";
}
```

