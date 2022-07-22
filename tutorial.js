// Ori Dataset
date1 = "2022-07-20T17:21:37-05:00";
date2 = "2022-07-20T17:23:13-05:00";
info "Unformatted Dates";
info date1;
info date2;
info "------------------";

// Format the Dates
date1_f = date1.left(date1.indexOf("T")).toDate() + " " + date1.subString(date1.indexOf("T")+1,date1.lastIndexOf("-"));
date2_f = date2.left(date2.indexOf("T")).toDate() + " " + date2.subString(date1.indexOf("T")+1,date2.lastIndexOf("-"));

info "Formatted Dates";
info date1_f;
info date2_f;
info "------------------";

// Compare
info "Compare";
info "date1_f > date2_f";
info date1_f.toDateTime() > date2_f.toDateTime();
info "date2_f > date1_f";
info date2_f.toDateTime() > date1_f.toDateTime();
