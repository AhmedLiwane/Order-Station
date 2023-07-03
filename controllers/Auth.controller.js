exports.resetPassword = async (req, res) => {
  try {
    var { email } = req.body;
    email = email.toLowerCase();
    let foundUser = await UserModel.findOne({ email });
    let foundCompany = await CompanyModel.findOne({ companyEmail: email });
    let foundRestaurant = await RestaurantModel.findOne({
      restaurantEmail: email,
    });
    let foundAdmin = await AdminModel.findOne({ email });

    if (!foundUser && !foundCompany && !foundAdmin && !foundRestaurant)
      return res.status(404).send({
        message: "Account not found",
        code: 404,
        success: false,
        date: Date.now(),
      });
    if (foundUser) {
      const token = jwt.sign(
        {
          id: foundUser.id,
          role: foundUser.role,
          email: foundUser.email,
          subject: "resetPassword",
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      const resetLink =
        "https://dev-admin.semsemapp.com/reset-password/" + token;
      foundUser.token = token;
      await foundUser.save();

      await resetPassword(
        email,
        resetLink,
        foundUser.firstName + "" + foundUser.lastName
      );

      res.status(200).send({
        message: "Sent a verification link to your email.",
        code: 200,
        success: true,
        date: Date.now(),
      });
    } else if (foundCompany) {
      const token = jwt.sign(
        {
          id: foundCompany.id,
          role: "company",
          email: foundCompany.companyEmail,
          subject: "resetPassword",
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      const resetLink =
        "https://dev-admin.semsemapp.com/reset-password/" + token;
      foundCompany.token = token;
      await foundCompany.save();

      await resetPassword(companyEmail, resetLink, foundCompany.companyName);

      res.status(200).send({
        message: "Sent a verification link to your company's email.",
        code: 200,
        success: true,
        date: Date.now(),
      });
    } else if (foundRestaurant) {
      const token = jwt.sign(
        {
          id: foundRestaurant.id,
          role: "restaurant",
          email: foundRestaurant.restaurantEmail,
          subject: "resetPassword",
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      const resetLink =
        "https://dev-admin.semsemapp.com/reset-password/" + token;
      foundRestaurant.token = token;
      await foundRestaurant.save();

      await resetPassword(email, resetLink, foundRestaurant.restaurantName);

      res.status(200).send({
        message: "Sent a verification link to your email.",
        code: 200,
        success: true,
        date: Date.now(),
      });
    } else if (foundAdmin) {
      const token = jwt.sign(
        {
          id: foundAdmin.id,
          role: "backoffice",
          email: foundAdmin.email,
          subject: "resetPassword",
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      const resetLink =
        "https://dev-admin.semsemapp.com/reset-password/" + token;
      foundAdmin.token = token;
      await foundAdmin.save();

      await resetPassword(email, resetLink, foundAdmin.userFullName);

      res.status(200).send({
        message: "Sent a verification link to your email.",
        code: 200,
        success: true,
        date: Date.now(),
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "This error is coming from resetPassword endpoint, please report to the sys administrator !",
      code: 500,
      success: false,
      date: Date.now(),
    });
  }
};

exports.confirmResetPassword = async (req, res) => {
  const token = req.headers["x-order-token"];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.subject === "resetPassword") {
      var { password } = req.body;
      if (decoded.role === "regular") {
        const foundUser = await UserModel.findOne({
          id: decoded.id,
          email: decoded.email,
          token: token,
        });
        if (!foundUser)
          return res.status(404).send({
            message: "User not found",
            code: 404,
            success: false,
            date: Date.now(),
          });
        foundUser.token = "";
        foundUser.password = await bcrypt.hash(password, 10);
        await foundUser.save();
        res.status(200).send({
          message: "Password reset successfully",
          code: 200,
          success: true,
          date: Date.now(),
        });
      } else if (decoded.role === "company") {
        const foundCompany = await CompanyModel.findOne({
          id: decoded.id,
          companyEmail: decoded.email,
          token: decoded.token,
        });
        if (!foundCompany)
          return res.status(404).send({
            message: "User not found",
            code: 404,
            success: false,
            date: Date.now(),
          });
        foundCompany.token = "";
        foundCompany.companyPassword = await bcrypt.hash(password, 10);
        await foundCompany.save();
        res.status(200).send({
          message: "Password reset successfully",
          code: 200,
          success: true,
          date: Date.now(),
        });
      } else if (
        decoded.role === "commercial" ||
        decoded.role === "superadmin"
      ) {
        const foundAdmin = await AdminModel.findOne({
          id: decoded.id,
          email: decoded.email,
          token: decoded.token,
        });
        if (!foundAdmin)
          return res.status(404).send({
            message: "User not found",
            code: 404,
            success: false,
            date: Date.now(),
          });
        foundAdmin.token = "";
        foundAdmin.password = await bcrypt.hash(password, 10);
        await foundAdmin.save();
        res.status(200).send({
          message: "Password reset successfully",
          code: 200,
          success: true,
          date: Date.now(),
        });
      }
    } else {
      res.status(403).send({
        message: "Invalid token",
        code: 403,
        success: false,
        date: Date.now(),
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        "This error is coming from confirmResetPassword endpoint, please report it to the sys administrator!",
      code: 500,
      success: false,
      date: Date.now(),
    });
  }
};
