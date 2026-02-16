import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration through with clause.

actor {
  public type Address = {
    name : Text;
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
    phone : Text;
  };

  public type Item = {
    id : Nat;
    name : Text;
    price : Nat;
  };

  public type OrderItem = {
    item : Item;
    quantity : Nat;
    total : Nat;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Nat;
    customer : Principal;
    items : [OrderItem];
    billingAddress : Address;
    shippingAddress : Address;
    status : OrderStatus;
    totalAmount : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    location : Text;
  };

  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextOrderId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  private func ensureUserRegistered(caller : Principal) {
    let currentRole = AccessControl.getUserRole(accessControlState, caller);
    switch (currentRole) {
      case (#guest) {
        if (not caller.isAnonymous()) {
          AccessControl.assignRole(accessControlState, caller, caller, #user);
        };
      };
      case (_) {};
    };
  };

  // Connectivity Check
  public query ({ caller }) func connectivityCheck() : async Text {
    "Service is running and reachable.";
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureUserRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Create Order
  public shared ({ caller }) func createOrder(items : [OrderItem], billingAddress : Address, shippingAddress : Address) : async Order {
    ensureUserRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    var totalAmount = 0;
    for (item in items.vals()) {
      totalAmount += item.total;
    };

    let currentTime = Time.now();
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      customer = caller;
      items;
      billingAddress;
      shippingAddress;
      status = #pending;
      totalAmount;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    orders.add(orderId, order);
    order;
  };

  // Get Order by ID (only owner or admin)
  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let order = orders.get(orderId);
    switch (order) {
      case (null) { null };
      case (?o) {
        if (o.customer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?o;
      };
    };
  };

  // List Orders for Caller
  public query ({ caller }) func listOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list orders");
    };

    var userOrdersList : [Order] = [];
    for ((_, order) in orders.entries()) {
      if (order.customer == caller) {
        userOrdersList := userOrdersList.concat([order]);
      };
    };
    userOrdersList;
  };

  // Update Order Status (admin only)
  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let order = orders.get(orderId);
    switch (order) {
      case (null) {
        null;
      };
      case (?o) {
        let updatedOrder = {
          o with
          status;
          updatedAt = Time.now();
        };
        orders.add(orderId, updatedOrder);
        ?updatedOrder;
      };
    };
  };

  // Cancel Order (only owner, must be authenticated user)
  public shared ({ caller }) func cancelOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel orders");
    };

    let order = orders.get(orderId);
    switch (order) {
      case (null) {
        null;
      };
      case (?o) {
        if (o.customer != caller) {
          Runtime.trap("Unauthorized: Can only cancel your own orders");
        };

        if (o.status == #cancelled) {
          return null;
        };

        let cancelledOrder = {
          o with
          status = #cancelled;
          updatedAt = Time.now();
        };
        orders.add(orderId, cancelledOrder);
        ?cancelledOrder;
      };
    };
  };

  // ADMIN FUNCTIONS

  /// Fetch all orders (admin only)
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch all orders");
    };
    orders.values().toArray();
  };

  /// Fetch order by ID without ownership check (admin only)
  public query ({ caller }) func getOrderById(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch any order");
    };
    orders.get(orderId);
  };

  /// Get caller's role/permission level
  public query ({ caller }) func getCallerRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  /// Assign/revoke admin role to/from a specific principal (admin only)
  public shared ({ caller }) func setAdminRole(target : Principal, isAdmin : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can modify roles");
    };
    let role : AccessControl.UserRole = if (isAdmin) { #admin } else { #user };
    AccessControl.assignRole(accessControlState, caller, target, role);
  };

  /// Bootstrap initial admin if system has no admins yet
  public shared ({ caller }) func initializeAdmin(adminToken : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
  };
};
