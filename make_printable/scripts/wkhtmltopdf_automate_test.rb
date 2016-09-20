# Simple automation of wkhtmltopdf
# 
# Author: Reed Spool
# 

FIFTY_STATES_AND_DC = ['AL','AK','AZ','AR','CA','CO','CT', 'DC', 'DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
WEIRD_ONES = ['African.American', 'Hispanic', 'Allegheny', 'NYC', 'Poverty']
ALL_THINGS = FIFTY_STATES_AND_DC + WEIRD_ONES

LIVE_DETAIL_INPUT = {
  BASE_URL: "http://www.afterschoolalliance.org/AA3PM",
  URL_PATH_PREFIX: "/detail.html#s/", # State code goes right between prefix & suffix,
  URL_PATH_SUFFIX: "/demand/p_of_children_in_programs_2014"
}

SANDBOX_PRINT_INPUT = {
  BASE_URL: "http://sandbox.timeplots.com",
  URL_PATH_PREFIX: "/viz/ccg/dist/printHEPASpecialReport.html#print/health/", # State code goes right between prefix & suffix,
  URL_PATH_SUFFIX: ""
}

LOCAL_PRINT_INPUT = {
  BASE_URL: "http://localhost:9000",
  URL_PATH_PREFIX: "/printHEPASpecialReport.html#print/health/", # State code goes right between prefix & suffix,
  URL_PATH_SUFFIX: ""
}

LOCAL_OUTPUT = {
  DIR: "samples_print",
  PATH_PREFIX: "/wkhtmltopdf_",
  PATH_SUFFIX: ".pdf"
}

PRODUCTION_OUTPUT = {
  DIR: '',
  PATH_PREFIX: '',
  PATH_SUFFIX: "-Kids-on-the-Move-Fact-Sheet.pdf"
}

STRATEGY = :list # toggle btwn :serial & :parallel & :single & :list
IN = SANDBOX_PRINT_INPUT
OUT = PRODUCTION_OUTPUT

def drive_paralell
  `mkdir #{OUT[:DIR]}`

  FIFTY_STATES_AND_DC.each do |s| 
    puts makeStatement s

    Process.spawn "wkhtmltopdf '#{ makeUrl s }' '#{ makeFilename s }' "
  end
end

def drive
  `mkdir #{OUT[:DIR]}`

  FIFTY_STATES_AND_DC.each do |s| 
    puts makeStatement s

    `wkhtmltopdf #{ makeUrl s } #{ makeFilename s } `
  end
end

def drive_single
  `mkdir #{OUT[:DIR]}`

  s = FIFTY_STATES_AND_DC[0]

  puts makeStatement s

  `wkhtmltopdf #{ makeUrl s } #{ makeFilename s } `
end

def drive_list
  ALL_THINGS.each do |s|
    puts makeStatement s
  end
end

def makeStatement s
<<eos
#{ makeUrl s }, #{ makeFilename s } 
eos
end

def makeUrl state
  concat IN[:BASE_URL], IN[:URL_PATH_PREFIX], state, IN[:URL_PATH_SUFFIX]
end

def makeFilename state
  concat OUT[:DIR], OUT[:PATH_PREFIX], state, OUT[:PATH_SUFFIX]
end

def concat (*a)
  a.join ''
end

case STRATEGY
when :serial
  drive
when :parallel
  drive_paralell
when :single
  drive_single
when :list
  drive_list
end