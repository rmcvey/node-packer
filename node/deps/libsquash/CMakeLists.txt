# Copyright (c) 2017 Minqi Pan <pmq2001@gmail.com>
#                    Shengyuan Liu <sounder.liu@gmail.com>
# 
# This file is part of libsquash, distributed under the MIT License
# For full terms see the included LICENSE file

PROJECT(libsquash C)
CMAKE_MINIMUM_REQUIRED(VERSION 2.6)

OPTION(BUILD_TESTS "Build a test of libsquash" OFF)
OPTION(BUILD_SAMPLE "Build the sample of libsquash" OFF)

FIND_PACKAGE(ZLIB)

INCLUDE_DIRECTORIES(src include ${ZLIB_INCLUDE_DIR})
FILE(GLOB SRC_H include/squash.h include/squash/*.h)
FILE(GLOB SRC_SQUASH src/*.c)
ADD_LIBRARY(squash ${SRC_H} ${SRC_SQUASH})

IF(BUILD_TESTS)
  ENABLE_TESTING()
  ADD_TEST(squash_tests squash_tests)
  FILE(GLOB SRC_TEST tests/*.c)
  ADD_EXECUTABLE(squash_tests ${SRC_TEST})
  TARGET_LINK_LIBRARIES(squash_tests squash ${ZLIB_LIBRARIES})
  if(WIN32)
    TARGET_LINK_LIBRARIES(squash_tests shlwapi.lib)
  endif()
ENDIF()

IF(BUILD_SAMPLE)
  add_definitions(-DRUBY_EXPORT)
  FILE(GLOB SRC_SAMPLE sample/*.c sample/*.h)
  INCLUDE_DIRECTORIES(sample)
  ADD_EXECUTABLE(squash_sample ${SRC_H} ${SRC_SQUASH} ${SRC_SAMPLE})
  TARGET_LINK_LIBRARIES(squash_sample squash ${ZLIB_LIBRARIES})
  if(WIN32)
    TARGET_LINK_LIBRARIES(squash_sample shlwapi.lib)
  endif()
  if(UNIX AND NOT APPLE)
    TARGET_LINK_LIBRARIES(squash_sample dl)
  endif()
ENDIF()
