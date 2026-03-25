import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type Plan = {
    #free;
    #pro;
  };

  type UsageRecord = {
    date : Text;
    count : Nat;
  };

  type UsageRecordArray = [UsageRecord];

  module UsageRecord {
    // Compare UsageRecord by date first, then count
    public func compare(usageRecord1 : UsageRecord, usageRecord2 : UsageRecord) : Order.Order {
      switch (Text.compare(usageRecord1.date, usageRecord2.date)) {
        case (#equal) { Nat.compare(usageRecord1.count, usageRecord2.count) };
        case (order) { order };
      };
    };

    // Compare UsageRecord by count only
    public func compareByCount(usageRecord1 : UsageRecord, usageRecord2 : UsageRecord) : Order.Order {
      Nat.compare(usageRecord1.count, usageRecord2.count);
    };
  };

  // State
  let plans = Map.empty<Principal, Plan>();
  let dailyUsage = Map.empty<Principal, UsageRecordArray>();

  // Init authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper Functions
  func getCurrentDateAsText() : Text {
    let currentTime = Time.now();
    // Convert time to text (year, month, day)
    let seconds = currentTime / 1_000_000_000;
    let day = seconds / (24 * 60 * 60);
    day.toText();
  };

  func getUsageForToday(caller : Principal) : Nat {
    switch (dailyUsage.get(caller)) {
      case (null) { 0 };
      case (?records) {
        let today = getCurrentDateAsText();
        switch (records.find(func(record) { record.date == today })) {
          case (?record) { record.count };
          case (null) { 0 };
        };
      };
    };
  };

  func getTopUsageRecords(caller : Principal, limit : Nat) : UsageRecordArray {
    switch (dailyUsage.get(caller)) {
      case (null) { [] };
      case (?records) {
        let sorted = records.sort(UsageRecord.compareByCount);
        let length = sorted.size();
        let start = switch (length > limit) {
          case (false) { 0 };
          case (true) { length - limit };
        };
        Array.tabulate(
          switch (length > limit) {
            case (false) { length };
            case (true) { limit };
          },
          func(i) { sorted[start + i] },
        );
      };
    };
  };

  // Core Functions
  public query ({ caller }) func getUserPlan(_ : ()) : async Plan {
    switch (plans.get(caller)) {
      case (null) { #free };
      case (?plan) { plan };
    };
  };

  public shared ({ caller }) func upgradeToPro(_ : ()) : async Plan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade to pro");
    };
    plans.add(caller, #pro);
    #pro;
  };

  public query ({ caller }) func getBackgroundRemoverUsage(_ : ()) : async Nat {
    getUsageForToday(caller);
  };

  public shared ({ caller }) func incrementBackgroundRemoverUsage(_ : ()) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can increment usage");
    };
    let currentCount = getUsageForToday(caller);
    let newCount = currentCount + 1;
    let today = getCurrentDateAsText();

    let updatedRecords = switch (dailyUsage.get(caller)) {
      case (null) {
        [{ date = today; count = newCount }];
      };
      case (?records) {
        // Remove old records beyond 5 days
        let filtered = Array.tabulate(
          switch (records.size() >= 5) {
            case (false) { records.size() };
            case (true) { 4 };
          },
          func(i) { records[i] },
        );
        let remaining = switch (filtered.size() > 0) {
          case (false) { [] };
          case (true) { filtered.sliceToArray(0, filtered.size() - 1) };
        };

        // Filter top 4 records by count
        let top4 = remaining.sort(UsageRecord.compareByCount);
        let topRecords = switch (top4.size() > 4) {
          case (false) { top4 };
          case (true) { Array.tabulate(4, func(i) { top4[i] }) };
        };

        topRecords.concat([{ date = today; count = newCount }]);
      };
    };

    dailyUsage.add(caller, updatedRecords);
    newCount;
  };

  public query ({ caller }) func canUseBackgroundRemover(_ : ()) : async Bool {
    switch (plans.get(caller)) {
      case (?#pro) { true };
      case (_) { getUsageForToday(caller) < 5 };
    };
  };

  public query ({ caller }) func getRemainingUsage(_ : ()) : async Nat {
    let usageToday = getUsageForToday(caller);
    let remaining = switch (usageToday >= 5) {
      case (false) { 5 - usageToday };
      case (true) { 0 };
    };

    switch (plans.get(caller)) {
      case (?#pro) { 0 };
      case (_) { remaining };
    };
  };

  public query ({ caller }) func getTopUsageRecordsQuery(limit : Nat) : async UsageRecordArray {
    getTopUsageRecords(caller, limit);
  };

  public query ({ caller }) func getLifetimeUsageCount(_ : ()) : async Nat {
    switch (dailyUsage.get(caller)) {
      case (null) { 0 };
      case (?records) {
        records.foldLeft(0, func(acc, record) { acc + record.count });
      };
    };
  };
};
