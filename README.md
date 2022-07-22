# ZohoCRM-DateTime-Field-Comparison-Deluge
A quick script for comparing Zoho CRM date time fields with a use case.

## Problem Statement
Zoho CRM Date Time fields are stored in this format - "2022-07-20T17:21:37-05:00", which is not recognized as a timestamp in Deluge. In order to perform date time comparisons or apply any date time functions in Deluge, we need to format it into "20-Jul-2022 17:21:37" and apply a `.toDateTime()` function.

ℹ️ `YYYY-MM-DDThh:mm:ssZ` Date Time format is an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. 

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
- Deluge tends to help identify and convert data types automatically, which is applicable to date time datatypes. Fortunately for us, we can replace "T" with a space. By doing so, the GMT suffix will be truncated by Deluge.
- If you're using purely for date time comparison (to find out which is more recent / earlier) like in this exercise, we can ignore the GMT suffix.

```javascript
// Format the Dates
date1_f = date1.replaceAll("T"," ").toDateTime();
date2_f = date2.replaceAll("T"," ").toDateTime();

info "Formatted Dates";
info date1_f;
info date2_f;
info "------------------";
```

### Compare
- Now that you've converted the date time fields to the required date time datatype format, with the help of the `.toDateTime()`, we can perform the date comparison.

```javascript
// Compare
info "Compare";
info "date1_f > date2_f";
info date1_f > date2_f;
info "date2_f > date1_f";
info date2_f > date1_f;
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
				createdTime_f = createdTime.replaceAll("T"," ").toDateTime();
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